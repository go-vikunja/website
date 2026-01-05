{ pkgs, inputs, ... }:

let
  unstable = import inputs.unstable { system = pkgs.stdenv.system; };
in {
  scripts.patch-workerd.exec = ''
  find node_modules/.pnpm/@cloudflare+workerd-linux-64@*/node_modules/@cloudflare/workerd-linux-64/bin/ -name workerd -print0 | xargs -I {} -0 patchelf --set-interpreter "$(<$NIX_CC/nix-support/dynamic-linker)" {}
  '';

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      package = unstable.pnpm;
    };
  };
}
