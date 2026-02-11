import type { JSONDocument, LexionEditor, LexionExtension } from "@lexion/core";

export const aiCommandNames = {
  applySuggestion: "ai.applySuggestion"
} as const;

export interface AIProviderRequest {
  readonly prompt: string;
  readonly selection: string;
  readonly document: JSONDocument;
}

export interface AIProvider {
  generate(request: AIProviderRequest): Promise<string>;
}

export class AIService {
  private readonly provider: AIProvider;

  public constructor(provider: AIProvider) {
    this.provider = provider;
  }

  public async generateForSelection(editor: LexionEditor, prompt: string): Promise<string> {
    const { from, to } = editor.state.selection;
    const selection = editor.state.doc.textBetween(from, to, "\n\n", "\n");

    return this.provider.generate({
      prompt,
      selection,
      document: editor.getJSON()
    });
  }

  public async generateAndApply(editor: LexionEditor, prompt: string): Promise<boolean> {
    const suggestion = await this.generateForSelection(editor, prompt);
    if (suggestion.length === 0) {
      return false;
    }
    return editor.execute(aiCommandNames.applySuggestion, suggestion);
  }
}

export const createAIService = (provider: AIProvider): AIService => new AIService(provider);

export const aiExtension: LexionExtension = {
  key: "ai",
  commands: () => ({
    [aiCommandNames.applySuggestion]: (context, suggestionValue) => {
      if (typeof suggestionValue !== "string") {
        return false;
      }

      const { from, to } = context.state.selection;
      context.dispatch(context.state.tr.insertText(suggestionValue, from, to));
      return true;
    }
  })
};
