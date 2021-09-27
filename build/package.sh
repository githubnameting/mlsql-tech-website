#!/usr/bin/env bash

set -e

# absolute path
root_dir=$(cd -P -- "$(dirname -- "$0")/.." && pwd -P)
cd ${root_dir}

# build frontend static resource
cd webapp
[[ -d "build" ]] && rm -rf build/*
yarn
yarn build
echo $(pwd)

console_static_resources_dir=${root_dir}/console/src/main/resources/static
echo ${console_static_resources_dir}
[[ ! -d ${console_static_resources_dir} ]] && mkdir -p ${console_static_resources_dir} || rm -rf ${console_static_resources_dir}/*
mv build/* ${console_static_resources_dir}

## build console fat jar
cd ../console
mvn_version=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)
if [[ -z "${version}" ]]; then
    export version=${mvn_version}
fi

mvn clean install -DskipTests -Ptest

# collect release package resource
cd ${root_dir}
export package_name=Mlsql-Website-${version}

[[ ! -d "dist" ]] && mkdir -p "dist" || rm -rf dist/*
mkdir -p dist/${package_name}

cd dist/${package_name}

## 1. make changelog file
if [[ -z "${changelog}" ]]; then
    echo "changelog not set, use UNKNOWN instead."
    changelog="UNKNOWN"
fi

echo "${changelog}" > ./CHANGELOG.md

## 2. make commit_sha file
echo `git rev-parse HEAD` | tee commit_SHA1

## 3. make version file
echo "${version}" > VERSION

## 4. copy license
cp ../../KYLIGENCE_LICENSE .

## 5. copy console jar file
cp ${root_dir}/console/target/website-console.jar .

## 6. copy config
mkdir conf
cp ${root_dir}/console/conf/mlsql-website.properties conf/

## 7. copy scripts
cp ${root_dir}/console/dev/startup.sh .
cp ${root_dir}/console/dev/shutdown.sh .

## 8. others
mkdir logs

cd ${root_dir}/dist
tar -zcvf ${package_name}.tar.gz ${package_name}
# build tarball for Kyligence Notebook

echo "====================================="
echo "Build Finished!"
echo "Location: ${root_dir}/dist/${package_name}.tar.gz"