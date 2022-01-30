# GitPw

GitPw is a specification for encrypting files and commit messages within a Git repository.

It is designed to be platform-agnostic, intendending to be implemented on an application-level, without requiring any special local or remote Git configurations, or even without a Git installation at all. GitPw is highly flexible, striving for backwards and forwards compatibility.

## Terminology

- **`GpwRepo`**
  - A Git repository that contains GitPw data
- **`GpwFile`**
  - A JSON file within a GpwRepo that contains some plaintext metadata alongside encrypted metadata and contents.
- **`GpwDoc`**
  - A type of GpwFile that when decrypted can represent a document of any format, albeit with some consideration for GitPw-specific headers.
- **`GpwBin`**
  - A type of GpwFile that provides metadata for encrypted binary (non-textual) files.
  - In this sense, all encrypted binary files require _two_ files.
- **`GpwSourceBin`**
  - An encrypted binary file whose metadata is described in a GpwBin.

## Encryption

No assumptions are made as to what methodologies are employed for encrypting the contents of a GitPw GpwRepo. Instead, GitPw provides the structure for any implementations of the spec to store within a GpwRepo's plaintext the details necessary to read and write to the GpwRepo.

In addition to allowing an encryption key from any algorithm, GitPw also provides the structure for encrypting a GpwRepo with multiple keys, whether of the same or different algorithms. This would work by using the output of the first encryption method as the input into the second encryption method, and so on until all encryption keys have been applied. For decryption, it would work in reverse, starting with the last encryption key and using the output of that decryption method as the input of the decryption method of the key that comes before it.

GitPw also provides a structure for storing old keys that are encrypted with the most current key, thus allowing users of GitPw implementations to update their GpwRepo's encryption configuration, whether by adding, removing, or updating encryption keys, all without losing access to old commits that were encrypted with the previous keys, and without needing to keep the passphrases to unlock those old keys.

Encryption keys are specified by a unique `type` string; for example `TR-WEB-AES-256-GCM`. It is up to the community to not build incompatible encryption methods using the same type. It is also not expected that all implementations of GitPw will support all encryption key types available from the community. If an implementation does not support an encryption type specified in a GpwRepo it has been tasked with processing, it should display an error to the user and quit further operation to prevent corruption of the data.

## GpwRepos

## GpwDocs

## Commits

Commit messages can also optionally be encrypted, depending on the implementation of GitPw and the end-user's actions. The first line of a commit message is always expected to be a plaintext message, even if it is a static string like "Update." A second line should only be provided if an encrypted commit message is to also be included. The second line should always be empty. The third line then will be the final ciphertext of the private commit message, encrypted via the same process as a GpwFile.

### Commit Message Examples

```
Public commit message
```

or

```
Public commit message

16bbc0497cd0c3c2b520e247GwQBranT9U0PiP4PrGsWzf+ioc7X86dkLeEc
```

## Binary Files

Any binary files not ignored by GitPw should be encrypted with the same process as text. These files are referred to as GpwSourceBins.

Beside every GpwSourceBin should be GpwBin of the same name (including extension), except with `.json` appended to the end of the file name. That GpwFile will provide metadata for the GpwSourceBin.
