#!/bin/bash -e

this_directory="$(cd $(dirname ${BASH_SOURCE:-$0}); pwd)"

_build() {
  cd "$this_directory/docker"

  build_command='cargo lambda build --release --target aarch64-unknown-linux-musl --output-format zip'

  # ビルド用の Docker を立ち上げる
  docker compose \
      --project-name cargo-lambda \
      --file 'compose.yaml' \
      up cargolambda --detach

  # ビルド
  docker compose \
      --project-name cargo-lambda \
      --file 'compose.yaml' \
      exec cargolambda \
      /bin/bash -c "$build_command"

  # Docker の停止
  docker compose \
    --project-name cargo-lambda \
    --file 'compose.yaml' \
    down
}

_cdk_diff() {
  cd "$this_directory/cdk"

  npm run clean
  npm install
  npm run cdk diff
}

_cdk_deploy() {
  cd "$this_directory/cdk"

  npm run clean
  npm install
  npm run cdk deploy
}

_clean() {
  cd "$this_directory/docker"

  # Docker の削除
  docker compose \
    --project-name cargo-lambda \
    --file 'compose.yaml' \
    down \
    --volumes \
    --rmi local \
    --remove-orphans
}

_help() {
  cat <<HELP
Cargo Lambda
  ARM64 で cargo lambda をビルド&デプロイ

  Commands
    build: cargo lambda をビルド
HELP
}

_cargolambda() {
  command="$1"
  [ $# -gt 0 ] && shift
  case "$command" in
    build )
      _build
      ;;
    clean )
      _clean
      ;;
    cdk_diff )
      _cdk_diff
      ;;
    cdk_deploy )
      _cdk_deploy
      ;;
    *)
      _help
      ;;
  esac

}

_cargolambda "$@"
