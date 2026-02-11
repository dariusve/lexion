function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeHref(href: string): string {
  const trimmed = href.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../") ||
    trimmed.startsWith("#")
  ) {
    return escapeHtml(trimmed);
  }

  return "#";
}

function renderInline(input: string): string {
  let index = 0;
  let output = "";

  while (index < input.length) {
    if (input.startsWith("**", index)) {
      const close = input.indexOf("**", index + 2);
      if (close !== -1) {
        output += `<strong>${renderInline(input.slice(index + 2, close))}</strong>`;
        index = close + 2;
        continue;
      }
    }

    if (input[index] === "`") {
      const close = input.indexOf("`", index + 1);
      if (close !== -1) {
        output += `<code>${escapeHtml(input.slice(index + 1, close))}</code>`;
        index = close + 1;
        continue;
      }
    }

    if (input[index] === "[") {
      const closeLabel = input.indexOf("]", index + 1);
      if (closeLabel !== -1 && input[closeLabel + 1] === "(") {
        const closeHref = input.indexOf(")", closeLabel + 2);
        if (closeHref !== -1) {
          const label = renderInline(input.slice(index + 1, closeLabel));
          const href = safeHref(input.slice(closeLabel + 2, closeHref));
          output += `<a href="${href}" target="_blank" rel="noreferrer noopener">${label}</a>`;
          index = closeHref + 1;
          continue;
        }
      }
    }

    output += escapeHtml(input[index] ?? "");
    index += 1;
  }

  return output;
}

function isTableDivider(line: string): boolean {
  const value = line.trim();
  if (!value.includes("|")) {
    return false;
  }

  const trimmed = value.startsWith("|") ? value.slice(1) : value;
  const noTrailing = trimmed.endsWith("|") ? trimmed.slice(0, -1) : trimmed;
  const cells = noTrailing.split("|").map((cell) => cell.trim());

  if (cells.length === 0) {
    return false;
  }

  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function splitTableLine(line: string): string[] {
  const trimmed = line.trim();
  const withoutLeading = trimmed.startsWith("|") ? trimmed.slice(1) : trimmed;
  const withoutTrailing = withoutLeading.endsWith("|")
    ? withoutLeading.slice(0, -1)
    : withoutLeading;

  return withoutTrailing.split("|").map((cell) => cell.trim());
}

function renderTable(lines: string[], start: number): { html: string; next: number } {
  const headers = splitTableLine(lines[start] ?? "");
  const divider = splitTableLine(lines[start + 1] ?? "");
  const aligns = divider.map((cell) => {
    const left = cell.startsWith(":");
    const right = cell.endsWith(":");

    if (left && right) {
      return "center";
    }
    if (right) {
      return "right";
    }
    return "left";
  });

  const rows: string[][] = [];
  let cursor = start + 2;

  while (cursor < lines.length) {
    const row = lines[cursor] ?? "";
    if (!row.trim() || !row.includes("|")) {
      break;
    }

    rows.push(splitTableLine(row));
    cursor += 1;
  }

  const headerHtml = headers
    .map((cell, index) => {
      const align = aligns[index] ?? "left";
      return `<th style="text-align:${align};">${renderInline(cell)}</th>`;
    })
    .join("");

  const bodyHtml = rows
    .map((row) => {
      const cells = row
        .map((cell, index) => {
          const align = aligns[index] ?? "left";
          return `<td style="text-align:${align};">${renderInline(cell)}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return {
    html: `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`,
    next: cursor
  };
}

function isBlockStart(line: string, nextLine: string | undefined): boolean {
  const value = line.trim();
  if (!value) {
    return true;
  }
  if (/^#{1,6}\s+/.test(value)) {
    return true;
  }
  if (/^```/.test(value)) {
    return true;
  }
  if (/^[-*]\s+/.test(value)) {
    return true;
  }
  if (/^\d+\.\s+/.test(value)) {
    return true;
  }
  if (value.includes("|") && nextLine && isTableDivider(nextLine)) {
    return true;
  }
  return false;
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const html: string[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    const line = lines[cursor] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      cursor += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2] ?? "";
      html.push(`<h${level}>${renderInline(text)}</h${level}>`);
      cursor += 1;
      continue;
    }

    const fence = trimmed.match(/^```([\w-]+)?\s*$/);
    if (fence) {
      const language = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : "";
      cursor += 1;
      const block: string[] = [];
      while (cursor < lines.length && !(lines[cursor] ?? "").trim().startsWith("```")) {
        block.push(lines[cursor] ?? "");
        cursor += 1;
      }
      if (cursor < lines.length) {
        cursor += 1;
      }
      html.push(`<pre><code${language}>${escapeHtml(block.join("\n"))}</code></pre>`);
      continue;
    }

    if (trimmed.includes("|") && isTableDivider(lines[cursor + 1] ?? "")) {
      const table = renderTable(lines, cursor);
      html.push(table.html);
      cursor = table.next;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (cursor < lines.length) {
        const value = (lines[cursor] ?? "").trim();
        const match = value.match(/^[-*]\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(`<li>${renderInline(match[1] ?? "")}</li>`);
        cursor += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (cursor < lines.length) {
        const value = (lines[cursor] ?? "").trim();
        const match = value.match(/^\d+\.\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(`<li>${renderInline(match[1] ?? "")}</li>`);
        cursor += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraph: string[] = [trimmed];
    cursor += 1;
    while (cursor < lines.length) {
      const next = lines[cursor] ?? "";
      const nextTrimmed = next.trim();
      if (!nextTrimmed || isBlockStart(next, lines[cursor + 1])) {
        break;
      }
      paragraph.push(nextTrimmed);
      cursor += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}
