import { EncryptedString, TiperiteConfig, DateString, UUID, Tag } from '.';

export type DocID = UUID;

/**
 * A 'Doc' is Tiperite's custom document format, equivalent to a 'file', 'note',
 *  'page', etc in other applications.
 */
export interface Doc {
  /**
   * The document's true creation timestamp
   */
  createdAt: DateString;
  /**
   * The document's true last modified timestamp
   */
  updatedAt: DateString;
  /**
   * The header hash map JSON-stringified and encrypted
   *
   * @see DocHeader
   */
  header: EncryptedString;
  /**
   * The body of the document broken up into encrypted 'blocks', which are
   *  related substrings within the document's full body string
   */
  body: EncryptedString[];
  id: DocID;
}

/**
 * A document's user-specified metadata
 */
export interface DocHeader {
  /**
   * Override (in display and sorting) the document's creation timestamp
   */
  created?: DateString;
  /**
   * Override (in display and sorting) the document's last modified timestamp
   */
  updated?: DateString;
  /**
   *  File-specific configuration overrides
   *
   * @example 'config config.key abc' => { 'config.key': 'abc' }
   */
  config?: TiperiteConfig;
  /**
   * 'Folder' to organize the document in
   *
   * @example '/a/b/c'
   */
  folder?: string;
  /**
   * A human-readable title for the document
   */
  title?: string;
  /**
   * A human-readable identifier for the document used for linking to the
   *  document from other documents.
   *
   * The slug _should_ be unique within a workspace but not it's not guaranteed.
   *
   * @example 'unique-for-linking'
   */
  slug?: string;
  /**
   * Tags to categorize the document
   *
   * @example 'tags #a #b #c' => ['a', 'b', 'c']
   * @example 'tag #a\ntag#b' => ['a', 'b']
   */
  tags?: Tag[];
  /**
   * Custom (non-system, user-provided) header fields that are prefixed with
   *  `x-` and can be used to store arbitrary data at the user's discretion.
   *
   * @example 'x-custom-field abc' => { x: { 'x-custom-field': 'abc' } }
   */
  x: Record<string, string>;
}

/**
 * The `docs` Redux state object
 *
 * @see RootState.docs
 */
export interface DocsState {
  allIds: DocID[];
  byId: Record<DocID, Doc>;
}
