{ pkgs, inputs, ... }:

let
  unstable = import inputs.unstable { system = pkgs.stdenv.system; };
in {
  packages = [ pkgs.git-lfs ];

  tasks."factory:setup".exec = ''
    set -euo pipefail
    cd "$DEVENV_ROOT"
    git lfs install --local --skip-repo
    git lfs pull
    pnpm install --frozen-lockfile

    if [[ ! -e devenv.local.nix ]]; then
      cat > devenv.local.nix <<'EOF'
    {
      processes.website.exec = "
        if test -n \"$ZWEIG_PREVIEW_URL_TEMPLATE\"; then
          export __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=$(zweig-preview-url 4321 | cut -d/ -f3)
        fi
        exec pnpm dev --ignore-lock --host 127.0.0.1 --port 4321
      ";
    }
    EOF
    fi
  '';

  scripts.patch-workerd.exec = ''
  find node_modules/.pnpm/@cloudflare+workerd-linux-64@*/node_modules/@cloudflare/workerd-linux-64/bin/ -name workerd -print0 | xargs -I {} -0 patchelf --set-interpreter "$(<$NIX_CC/nix-support/dynamic-linker)" {}
  '';

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    pnpm = {
      enable = true;
      package = unstable.pnpm;
    };
  };
}
