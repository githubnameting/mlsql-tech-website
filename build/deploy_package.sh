#!/usr/bin/env bash

# absolute path
root_dir=$(cd -P -- "$(dirname -- "$0")/.." && pwd -P)
cd ${root_dir}

## config
[[ -z ${deploy_env_host} ]] && deploy_env_host="10.1.3.197"
[[ -z ${deploy_home} ]] && deploy_home="/usr/local/Mlsql-Website"

scp dist/Mlsql-Website-${version}.tar.gz root@${deploy_env_host}:/tmp
ssh -tt root@"${deploy_env_host}" << EOF
set -e
[[ ! -d ${deploy_home} ]] && mkdir ${deploy_home} || ${deploy_home}/Mlsql-Website-${version}/shutdown.sh
rm -rf ${deploy_home}/*
mv /tmp/Mlsql-Website-${version}.tar.gz ${deploy_home}
cd ${deploy_home}
tar -xvf Mlsql-Website-${version}.tar.gz
cd Mlsql-Website-${version}
./startup.sh
exit 0
EOF