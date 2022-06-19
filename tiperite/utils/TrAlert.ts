/**
 * A utility class for displaying alerts and prompts.
 *
 * Currently this is just a promise-based wrapper for the native `window`
 *  functions but it may be expanded in the future.
 */
export class TrAlert {
  /**
   * Prompt the user to confirm an action
   */
  public static confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const res = window.confirm(message);
      resolve(res);
    });
  }

  /**
   * Prompt the user to enter a string
   */
  public static prompt(
    message: string,
    defaultValue?: string,
  ): Promise<string | null> {
    return new Promise((resolve) => {
      const res = window.prompt(message, defaultValue);
      resolve(res);
    });
  }

  /**
   * Display an alert
   */
  public static alert(message: string): Promise<void> {
    return new Promise((resolve) => {
      window.alert(message);
      resolve();
    });
  }
}
