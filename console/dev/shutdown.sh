#!/bin/bash

# Copyright (C) 2021 Kyligence Inc. All rights reserved.
#
# http://kyligence.io
#
# This software is the confidential and proprietary information of
# Kyligence Inc. ("Confidential Information"). You shall not disclose
# such Confidential Information and shall use it only in accordance
# with the terms of the license agreement you entered into with
# Kyligence Inc.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
pid_file=${dir}/pid

function check_alive() {
    for ((i=1;i<=15;i+=1))
    do
        printf "."
        sleep 1
        killed_pid=$(ps -ef | grep $1 | grep -v grep | awk '{print $2}')
        if [[ -z ${killed_pid} ]]; then
            echo ""
            return 1
        fi
    done
    echo ""
    return 0
}

function check_after() {
    # check kill status
    check_alive "$1"
    status=$?
    if [[ ${status} -eq 1 ]]; then
        echo "Mlsql-website service has been stopped, pid=$1."
        return
    else
        echo "Mlsql-website service termination failed! The process [pid=$1] is about to be forcibly terminated."
    fi
    # force kill and check
    kill -9 "$1"
    check_alive "$1"
    status=$?
    if [[ ${status} -eq 1 ]]; then
        echo "Mlsql-website service has been forcibly stopped, pid=$1."
    else
        echo -e "Mlsql-website service didn't stopped completely. Please check the cause of the failure or contact IT support."
    fi
}

if [[ -e "${pid_file}" ]]
then
    pid=$(cat "${pid_file}")
    if [[ -n $(ps -ef | grep ${pid} | grep -v grep) ]]; then
        kill "${pid}"
    fi
    rm -f "${pid_file}"
    check_after "${pid}"
elif [[ -n `ps -ef | grep ${dir} | grep -v grep` ]]
then
    pid=$(ps -ef | grep "${dir}" | grep semantic | grep -v grep | awk '{print $2}')
    kill "${pid}"
    check_after "$pid"
else
    echo "There is no mlsql-website service running."
fi
