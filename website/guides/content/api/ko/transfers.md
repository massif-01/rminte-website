# 파일 및 이미지 전송

일반 파일과 APP/WWW 이미지는 전용 바이너리 경로를 사용합니다. 본문에는 원본 파일 바이트가 포함되어 있습니다. 성공적인 응답에는 반드시 코드가 포함될 필요는 없습니다. 이러한 경로는 277개의 논리적 API 이름과 별개입니다.

## 일반 파일

| 경로 | 메서드·권한 | 요청 및 결과 |
| --- | --- | --- |
| /api/v1/file/download | GET, READ이며 민감한 경로에는 ADMIN이 필요합니다. | 쿼리의 절대 경로입니다. 응답은 디렉터리가 아닌 파일 바이트입니다. |
| /api/v1/file/upload | POST, ADMIN | 쿼리로 대상 경로를, 본문으로 원본 바이트를 보냅니다. 성공 시 path/size/status=uploaded를 반환합니다. |

HTTP 업로드는 `/sdcard/` 아래에서 검증된 일반 파일만 허용합니다. storage.rename/delete 같은 다른 파일 작업은 경로 범위가 다르며, 이를 근거로 `/spiffs/` 또는 `/www/`에 HTTP 업로드를 할 수는 없습니다. 민감한 설정과 개인 키를 읽으려면 ADMIN이 필요합니다. 관리형 자동화 디렉터리, 별칭, 백업, 임시 파일은 보호됩니다. 해당 객체의 설정 API로 편집하세요.

업로드는 300초 수신 예산으로 최대 16MiB를 허용하며 메모리, 여유 공간 및 스토리지 상태에 따라 제한됩니다. 비어 있지 않은 완전한 파일 하나를 제공하십시오. 반복되는 요청은 청크를 추가하지 않습니다. 업로드는 기존 대상을 대체합니다. 필요한 콘텐츠를 먼저 보존하세요. URL 인코딩 경로는 한 번만 가능합니다.

실행하기 전에 TS_BASE 및 TS_TOKEN을 구성합니다.

```sh
curl --connect-timeout 5 --max-time 330 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @example.txt \
  "$TS_BASE/api/v1/file/upload?path=/sdcard/example.txt"

curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  --get --data-urlencode 'path=/sdcard/example.txt' \
  "$TS_BASE/api/v1/file/download" -o downloaded-example.txt
```

.tscfg 업로드는 config_pack.valid/reason/signature 정보를 추가합니다. 업로드됨은 저장되었지만 신뢰할 수 없거나 적용되지 않았음을 의미합니다. 개체별 가져오기를 통해 미리 보고 적용합니다. config.pack.apply는 일반 구성을 적용하지 않습니다. 일반 데이터 패키지와 명령 포함 규칙 패키지에는 서명 사용 확인이 다릅니다. 일반 검증은 규칙 가져오기 검증을 대체하지 않습니다.

file_replace_uncertain 또는 연결 끊김의 경우 파일 메타데이터를 검사하고 해당 콘텐츠를 다운로드한 후 다시 시도하세요.

## 이미지 준비

완전한 APP 펌웨어 이미지와 하드웨어, 파티션 레이아웃 및 펌웨어 버전에 대해 일치하는 www.bin을 얻습니다. WWW 이미지는 개별 HTML 파일이 아닙니다. 구성을 백업하고 안정적인 전원 및 유지 관리 기간을 보장하고 복구 경로를 준비합니다.

다운로드는 HTTP와 HTTPS를 지원합니다. HTTPS는 기본적으로 시스템의 신뢰할 수 있는 인증서를 사용합니다. skip_verify는 다운로드 옵션이며, 이미지 손상·호환성 문제나 용량 부족을 해결하지 못합니다. 보통 false로 유지하세요. 현재 시작 API는 사설 CA용 cert_pem 매개변수를 지원하지 않습니다.

## 전송 방법을 선택하세요

| 메서드 | API | 요구 사항 |
| --- | --- | --- |
| Device downloads | ota.start_url / ota.www.start | 장치는 이미지 서버에 연결할 수 있습니다. 네트워크 및 저장소 확인 |
| SD file | ota.start_file / ota.www.start_sdcard | 완전한 이미지 파일이 들어 있는 마운트된 SD 카드 |
| Client uploads | 아래 전용 바이너리 경로 | 클라이언트에는 완전한 파일이 있습니다. 장치에는 스테이징 및 복구 캐시를 위한 쓰기 가능한 SD가 있습니다. |

| 경로 | 메서드·권한 | 옵션 및 성공 응답 |
| --- | --- | --- |
| /api/v1/ota/firmware | POST, ADMIN | 완전한 APP 이미지 본문입니다. 쿼리의 auto_reboot 기본값은 true입니다. 성공 응답에는 status=success, size, message, reboot_pending, auto_reboot_requested가 포함됩니다. |
| /api/v1/ota/www | POST, ADMIN | 완전한 www.bin 본문입니다. status=success, size, message가 반환되며 자동 재시작하지 않습니다. |

두 경로 모두 최대 16MiB, 수신 제한 시간 300초이며 대상 파티션 용량과 메모리 제한도 적용됩니다. 펌웨어 헤더와 설치 완전성을 검사합니다. 업로드 성공 시 SD 복구 파일과 자동 복구가 비활성화된 매니페스트를 저장합니다. 재시작 후 애플리케이션의 정상 동작 확인은 별도 단계입니다.

이 예에서는 유지 관리 프로세스가 먼저 결과를 검사할 수 있도록 자동 다시 시작을 비활성화합니다.

```sh
curl --connect-timeout 5 --max-time 600 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @firmware.bin \
  "$TS_BASE/api/v1/ota/firmware?auto_reboot=false"
```

firmware.bin은 클라이언트의 파일 이름입니다. 완전한 펌웨어 이미지 파일로 바꾸세요. 이 요청은 장치에 실제로 쓰기를 수행합니다. auto_reboot=true이면 성공 응답 후 약 2초 뒤 재시작이 요청되며 연결이 끊길 수 있습니다.

## 진행 및 완료 확인

URL 또는 SD 시작 후 WWW의 경우 ota.progress 또는 ota.www.progress를 읽습니다. 개인 로그인별 작업 접수 정보 없이 장치 전체에서 진행됩니다. 동시 시작이나 다른 업데이트 취소를 방지하기 위해 하나의 유지 관리 프로세스를 통해 업데이트를 조정합니다.

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/ota/progress"
```

APP 진행 정보에는 state/percent/received_size/total_size/message가 포함됩니다. WWW는 received/total을 사용하며 running도 제공합니다. pending_reboot는 재시작 필요, error는 실패를 뜻합니다. 진행률 100%만으로 새 버전이 실행 중이라고 판단하지 마세요. 취소하려면 ota.abort 또는 ota.www.abort에 빈 객체를 POST하고, 다시 시작하기 전에 상태를 확인하세요.

바이너리 업로드 결과는 전역 진행 정보가 해당 요청을 식별한다고 가정하지 말고 HTTP 응답으로 확인하세요. HTTP409와 함께 status=partial, error=recovery_cache_failed, flash_written=true가 반환되면 Flash 쓰기는 완료되었지만 SD 복구 캐시가 완전히 저장되지 않은 상태입니다. 파티션과 복구 파일을 확인하세요. 응답을 받지 못했다는 사실만으로 쓰기가 수행되지 않았다고 판단해서는 안 됩니다.

펌웨어 설치 후 계획에 따라 재시작하고 다시 로그인하세요. ota.status/partitions와 애플리케이션의 정상 동작을 확인하세요. ota.validate는 현재 펌웨어를 확정하므로 정상 동작 확인 후에 호출하세요.

## 롤백 및 SD 복구

ota.rollback 전에 ota.partitions.can_rollback을 확인하세요. 롤백이 즉시 다시 시작될 수 있습니다. 버전, 구성 호환성 및 애플리케이션 상태를 다시 연결하고 확인합니다.

SD 복구는 `/sdcard/recovery/` 아래의 TianShanOS.bin, www.bin, manifest.json을 사용합니다. armed는 복구 활성화 여부를, force는 버전 비교 방식을 제어합니다. 파일이 있다는 사실만으로 복구가 활성화되었다고 판단하지 마세요. 복구는 이후 부팅과 영구 저장소에 영향을 주므로 배포자의 복구 절차를 따르세요. 파일 업로드만으로 복구 성공이 입증되지는 않습니다.

복구 준비, 상태 또는 인증 API가 노출되지 않습니다. 경로를 고안하거나 ota.upload_begin/end/abort를 완전한 분할 전송 프로토콜로 취급하지 마십시오. 일반 통합에서는 위의 바이너리 경로를 사용해야 합니다.
