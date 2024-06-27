{ pkgs, inputs, ... }:

let
  unstable = import inputs.unstable { system = pkgs.stdenv.system; };
in {
  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      package = unstable.pnpm;
    };
  };

  packages = [
    pkgs.nodePackages.wrangler
  ];
}
