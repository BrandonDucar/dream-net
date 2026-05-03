// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/sync_trie.proto


export interface DbTrieNode {
  'key'?: (Buffer | Uint8Array | string);
  'childChars'?: (number)[];
  'items'?: (number);
  'childHashes'?: ({[key: number]: Buffer | Uint8Array | string});
}

export interface DbTrieNode__Output {
  'key': (Buffer);
  'childChars': (number)[];
  'items': (number);
  'childHashes': ({[key: number]: Buffer});
}
