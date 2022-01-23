# Gitveil

Gitveil is a specification for encrypting files and commit messages within a Git repository.

It is designed to be platform-agnostic, intendending to be implemented on an application-level without requiring any special local or remote Git configuration, or even a Git installation at all. Gitveil is highly flexible, striving for backwards and forwards compatibility.

## Overview

Gitviel at its core is two primary concepts:

1. Workspace
2. Doc

A **Workspace** is simply a Git repository that contains Gitveil data. A **Doc** is a JSON file within a Workspace that contains some plaintext metadata alongside encrypted contents and metadata. A Doc in its encrypted form can be a document of any format, albeit with some special consideration for Gitveil-specific headers.

## Encryption

No assumptions are made as to what methodologies are employed for encrypting the contents of a Gitveil Workspace. Instead, Gitveil provides the structure for an implementation of the spec to store within a Workspace's plaintext the details necessary to read and write to the Workspace.

In addition to allowing an encryption key from any algorithm, Gitveil also provides the structure for encrypting a Workspace with _multiple_ keys, whether of the same or different algorithms. This would work by using the output of the first encryption method as the input into the second encryption method, and so on until all encryption keys have been applied. For decryption, it would work in reverse, starting with the last encryption key and using the output of that decryption method as the input of the decryption method of the key that comes before it.

Gitviel also provides a structure for storing old keys that are encrypted with the most current, thus allowing users of Gitveil implementations to update their configuration, whether by adding, removing, or updating encryption keys, all without losing access to old commits that were encrypted with the previous keys.

Encryption keys are specified by a unique `type` string. For example `TR-WEB-AES-256-GCM`. It is up to the community to not build incompatible encryption methods under the same type. It is also not expected that all implementations of Gitveil will support all encryption key types available from the community. If an implementation does not support an encryption type specified in a Workspace, it should display an error to the user and quit further operation to prevent corruption of the data.

## Workspace

## Doc

## Commits

Commit messages can also optionally be encrypted, depending on the implementation of Gitveil and the end-user's actions. The first line of a commit message is always expected to be a plaintext message, even if it's as simple as an unchanging "Update" string. A second line should only be provided if an encrypted commit message is to also be included. The second line should be empty. The third line then will be the final ciphertext of the private commit message, encrypted via the same process as a Doc's content.

```
Public commit message
```

or

```
Public commit message

ABC1234encrypted-private-commit-messageDEF236...
```
