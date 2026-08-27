import { RawErrorEvent } from '@error-debugger/shared-types';

export class GitErrorParser {
  public parseGitOutput(gitOutput: string): RawErrorEvent | null {
    if (!gitOutput) return null;

    const isGitError =
      gitOutput.includes('fatal:') ||
      gitOutput.includes('error:') ||
      gitOutput.includes('CONFLICT') ||
      gitOutput.includes('rejected') ||
      gitOutput.includes('detached HEAD');

    if (!isGitError) return null;

    let filePath: string | undefined;
    const conflictMatch = gitOutput.match(/CONFLICT \((?:content|add\/add)\): Merge conflict in (.+)/);
    if (conflictMatch) {
      filePath = conflictMatch[1].trim();
    }

    return {
      id: `git-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      source: 'git',
      rawText: gitOutput,
      filePath,
      timestamp: Date.now()
    };
  }
}
