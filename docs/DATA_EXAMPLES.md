# Lexion Data Examples

This page shows practical examples of data returned by Lexion APIs.

## `@lexion-rte/core` - `editor.getJSON()`

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Hello " },
        { "type": "text", "marks": [{ "type": "strong" }], "text": "Lexion" }
      ]
    },
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Section title" }]
    },
    {
      "type": "bullet_list",
      "content": [
        {
          "type": "list_item",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "First item" }]
            }
          ]
        }
      ]
    }
  ]
}
```

## Adapters (`web`/`react`/`vue`/`vue2`) - Change Callback Value

`onChange` / `update:modelValue` returns the same `JSONDocument` shape used by core.

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Current editor value" }]
    }
  ]
}
```

## `@lexion-rte/tools`

### `toHTML(editor)`

```html
<p>Hello <strong>Lexion</strong></p><h2>Section title</h2>
```

### `toText(editor)`

```txt
Hello Lexion

Section title
```

## `apps/api` Response Examples

### `POST /documents/from-text`

```json
{
  "document": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Imported text value" }]
      }
    ]
  }
}
```

### `POST /documents/to-text`

```json
{
  "text": "Imported text value"
}
```

### `POST /commands/execute`

```json
{
  "executed": true,
  "document": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Updated value after command" }]
      }
    ]
  }
}
```

## `apps/collab-server` WebSocket Messages

### Client -> Server (`update`)

```json
{
  "type": "update",
  "update": "BASE64_YJS_UPDATE"
}
```

### Server -> Client (`sync`)

```json
{
  "type": "sync",
  "update": "BASE64_YJS_UPDATE"
}
```

## `@lexion-rte/extensions` AI Service Return

`AIService.generateForSelection(...)` returns a `string` suggestion.

```txt
Rewrite this paragraph with a concise tone and active voice.
```
