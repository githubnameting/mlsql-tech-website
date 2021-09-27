#!/usr/bin/env bash

root_dir=$(cd -P -- "$(dirname -- "$0")/../../" && pwd -P)

cd ${root_dir}

console_static_resources_dir=${root_dir}/console/src/main/resources/static
echo ${console_static_resources_dir}
[[ ! -d ${console_static_resources_dir} ]] && mkdir -p ${console_static_resources_dir} || rm -rf ${console_static_resources_dir}/*

cd webapp

yarn
yarn build

mv build/* ../console/src/main/resources/static/

cd ../console
mvn clean install -DskipTests

echo "update web resources successful."

