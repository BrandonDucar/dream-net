{ pkgs }: {
  deps = [
    pkgs.nodejs_22
    pkgs.pnpm
    pkgs.tsx
    pkgs.git
    pkgs.postgresql
    pkgs.openssl
    pkgs.curl
    pkgs.jq
  ];
}
