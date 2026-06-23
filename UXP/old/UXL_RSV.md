---
pattern_file: "UXL_RSV"
journey_code: "RSV"
journey_name: "문제해결/CS"
journey_description: "고객이 문제를 체감하거나 문의하기 전에 이상 징후를 감지하여, 선제적 안내와 즉각적 해결 경로를 제공합니다. 채널 간 상담 맥락을 단절 없이 연결하고, 발화 의도를 실시간으로 해석해 즉시 실행 가능한 해결 흐름을 완성해야 합니다."
patterns:
  - pattern_id: "UXL_RSV_1"
    pattern_name: "선제적 문제 감지"
    screen_type: "cs_resolution"
    trigger_data:
      - field: "user.anomaly_signal"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "usage_anomaly_data"
        source: "real_time_api"
        required: true
      - key: "billing_anomaly_data"
        source: "real_time_api"
        required: false
      - key: "benefit_utilization_data"
        source: "user_profile"
        required: false
    outputs:
      - component: "ProactiveAlertCard"
        slot: "home_or_cs_entry"
        condition: "anomaly_signal IS NOT NULL"
        state: "proactive_visible"
    do:
      - "IF data_exhaustion_predicted_within_hours < 24 THEN render DataWarningCard with remaining_data AND gift_data_cta"
      - "IF billing_amount_anomaly THEN render BillingAnomalyAlert with anomaly_reason AND resolution_cta"
      - "IF unused_benefit_count > 0 THEN render UnusedBenefitAlert with benefit_count AND usage_guide_cta"
      - "IF issue_resolution_possible_preemptively THEN provide resolution_path without requiring user_inquiry first"
    dont:
      - trigger: "anomaly signal detected"
        rejection: "wait for user to contact CS before surfacing issue"
        fallback: "proactively surface ProactiveAlertCard at home or CS entry"
    copy_template:
      data_warning: "지금 사용 패턴이라면, 어머니의 데이터는 내일 모두 소진될 가능성이 있어요."
      data_gift_suggestion: "선물할 데이터 ${gift_amount}GB"
      billing_anomaly: "${user.name} 고객님, 이번 달 요금이 많이 나왔어요."
      unused_benefit: "사용하지 않는 혜택 ${unused_count}개가 있어요."
      proactive_fix: "현숙님의 패턴에 맞는 최적 구성을 미리 설정해두었어요. 현숙님에게 맞는 개선사항을 한 번에 적용해볼까요?"
    fallback_behavior:
      condition: "anomaly_data unavailable"
      render: "render standard cs_entry without proactive alert"

  - pattern_id: "UXL_RSV_2"
    pattern_name: "단절 없는 상담 맥락 연결"
    screen_type: "cs_resolution"
    trigger_data:
      - field: "consultation.channel_switch"
        operator: "eq"
        value: "true"
    inputs:
      - key: "consultation_history"
        source: "session_state"
        required: true
      - key: "task_progress_stage"
        source: "session_state"
        required: true
      - key: "channel_target"
        operator: "enum"
        values: ["app", "agent", "offline_store"]
        required: true
    outputs:
      - component: "ContinuedConsultationView"
        slot: "cs_primary"
        condition: "channel_switch == true"
        state: "context_preserved"
    do:
      - "IF channel_switch == true THEN restore consultation_history and task_progress_stage in new channel without re-entry"
      - "IF task_difficulty_detected AND offline_preferred THEN transfer task_progress_stage to nearest_store with IMEI step pre-indicated"
      - "IF channel == 'offline_store' THEN surface 'IMEI 입력 단계부터 개통 진행' label for store agent"
    dont:
      - trigger: "user switches channel during task"
        rejection: "reset task_progress_stage or clear consultation_history"
        fallback: "preserve and restore all context in destination channel"
      - trigger: "channel transfer occurs"
        rejection: "require user to re-explain situation or re-enter data"
        fallback: "pre-populate destination channel with existing context"
    copy_template:
      task_difficulty_detected: "태스크 이행에 있어 고민으로 판단했어요."
      store_transfer: "가까운 매장에서 이어보실 수 있어요."
      store_context: "IMEI 입력 단계부터 개통 진행"
      smart_planner_sync: "스마트플래너 상 데이터 연동"
      online_to_offline: "태스크 진행 중 고객에게 어려움이 발생한 것으로 감지되는 경우, 오프라인 매장 연결까지 자연스럽게 이어지도록 지원합니다."
    fallback_behavior:
      condition: "consultation_history unavailable"
      render: "render fresh cs_entry with apology for context loss"

  - pattern_id: "UXL_RSV_3"
    pattern_name: "인텐트 기반 실시간 상담 가이드"
    screen_type: "cs_resolution"
    trigger_data:
      - field: "consultation.user_utterance"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "user_utterance"
        source: "manual_input"
        required: true
      - key: "user_current_state"
        source: "real_time_api"
        required: true
      - key: "consultation_context"
        source: "session_state"
        required: true
    outputs:
      - component: "IntentResolvedActionCard"
        slot: "conversation_inline"
        condition: "intent_resolved == true"
        state: "action_ready"
    do:
      - "IF user_utterance matches intent:'terminate_subscription' THEN surface termination_flow inline with refund_breakdown"
      - "IF refund_available THEN pre-compute and display refund_amount before user asks"
      - "IF linked_benefits_affected THEN proactively list affected_benefit_names"
      - "IF termination_method_choice required THEN present binary_choice inline: 즉시해지 vs 예약해지"
      - "IF user confirms action THEN proceed inline without page redirect"
    dont:
      - trigger: "action required during conversation"
        rejection: "redirect user to separate task screen outside conversation"
        fallback: "embed action completion inline within conversation thread"
      - trigger: "consultation in progress"
        rejection: "provide information only without enabling action"
        fallback: "combine information display with inline action execution"
    copy_template:
      termination_notice: "즉시해지를 선택하면 오늘 구독이 바로 종료돼요. 환불 예상 금액을 먼저 확인해 주세요."
      refund_breakdown:
        total_subscription: "총 구독가: ${subscription_price}원"
        usage_period_deduction: "이용 기간 차감: -${usage_deduction}원"
        coupon_deduction: "쿠폰 할인 차감: ${coupon_deduction}원"
        final_refund: "최종 환불 금액: ${final_refund_amount}원"
      linked_benefit_termination: "환불 금액은 ${final_refund_amount}원으로 이용 기간을 차감 계산된 금액이고, ${linked_service} 이용과 ${coupon_name} 혜택은 함께 종료돼요."
      termination_method_choice:
        immediate: "즉시 해지할게요 (잔여기간 환불)"
        scheduled: "예약 해지할게요 (결제일까지 혜택 유지)"
      confirmation_prompt: "이대로 즉시 해지를 진행할까요?"
      confirmed_response: "네, 지금 바로 ${product_name}를 해지할게요."
    fallback_behavior:
      condition: "intent_resolution failed"
      render: "render open_question_prompt asking user to clarify intent"
---

# UXL_RSV — 문제해결/CS (Resolution)

> **검수 목적**: 고객의 CS 여정에서 선제적 감지, 채널 간 맥락 연결, 실시간 인텐트 기반 즉시 실행 화면을 AI가 일관되게 재현하기 위한 Single Source of Truth.

---

## UXL_RSV_1 — 선제적 문제 감지

### 개요

고객이 문제를 체감하거나 직접 문의하기 전에 이상 징후를 감지하여, 문제 상황을 사전에 안내하고 즉각적인 해결 경로를 제공해야 합니다.

### BEHAVIOR

고객은 문제가 발생한 이후에야 원인과 해결 방법을 찾기 위해 문의나 탐색을 시작합니다.

### AS-IS (문제 상황)

이상 징후가 사전에 포착되지 않아 고객이 문제를 인지한 뒤에야 대응이 시작되며, 이 과정에서 불필요한 추가 행동이 발생합니다.

### TO-BE (목표 상태)

고객의 이용 패턴과 상태 데이터를 기반으로 문제를 선제적으로 감지하고, 고객이 인지하기 전에 전 단계에서 해결 경로를 제시해야 합니다.

### RULE 1

고객의 문제 해결에 필요한 정보와 대응 경로를 선제적으로 제공해야 합니다.

**DO**
- 고객 데이터를 분석하여 이상 징후를 감지하고, 해결 방안까지 선제적으로 제공합니다.
- 고객이 문제를 체감하기 전에 시스템에서 먼저 감지하고 해결하기 위한 태스크를 제안합니다.
- 홈 진입 시 고객의 상태를 분석한 문제 원인을 기반으로, 맞춤 태스크 수행 또는 상담을 선제적으로 안내합니다.

**DON'T**
- 고객이 직접 문제를 발견하고 해결책을 탐색할 때까지 기다리지 않습니다.

### Scenario — 상황별 적용 방식

| 이상 유형 | 트리거 조건 | 선제 안내 내용 |
|---|---|---|
| 청구 요금 과다 | `billing_anomaly_detected == true` | "이번 달 요금이 많이 나왔어요." + 원인 분석 + 해결 경로 |
| 데이터 부족 | `data_exhaustion_predicted_within_hours < 24` | "데이터가 내일 모두 소진될 가능성이 있어요." + 데이터 선물 CTA |
| 혜택 미활용 | `unused_benefit_count > 0` | "사용하지 않는 혜택 {N}개가 있어요." + 혜택 사용 안내 |

[IMAGE_REQUIRED: RSV_1_scenario_billing_anomaly_mockup]
[IMAGE_REQUIRED: RSV_1_scenario_data_shortage_mockup]
[IMAGE_REQUIRED: RSV_1_scenario_unused_benefit_mockup]

---

## UXL_RSV_2 — 단절 없는 상담 맥락 연결

### 개요

온·오프라인 채널의 상담 이력과 진행 상태를 실시간으로 동기화하여 접점 이동 시에도 고객이 반복 설명하지 않도록, 단절 없는 옴니채널 경험을 제공해야 합니다.

### BEHAVIOR

고객은 문제 해결 과정에서 앱, 상담원, 오프라인 등 다양한 채널을 이동할 때마다 동일한 상황과 이력을 반복 설명하며 상담을 이어갑니다.

### AS-IS (문제 상황)

채널 간 데이터와 진행 상태가 연결되지 않아, 고객이 채널을 이동할 때마다 동일한 문제를 다시 설명하고 해결 과정을 반복해야 합니다.

### TO-BE (목표 상태)

모든 채널에서 고객의 상태와 상담 맥락이 하나의 흐름으로 연결되어, 접점이 바뀌어도 동일한 문제 해결 과정이 끊김 없이 이어지도록 해야 합니다. 고객이 하나의 통합 서비스 안에서 문제를 해결할 수 있는 옴니채널 경험으로 고도화합니다.

### RULE 1

고객의 상담 여정은 채널과 관계없이 단일 여정으로 유지되어야 하며, 이전 상태를 기반으로 즉시 이어질 수 있어야 합니다.

**DO**
- 채널 전환 시 고객의 현재 상태와 진행 단계가 다음으로 즉시 이어지도록 구성합니다.
- 태스크 진행 중 고객에게 어려움이 발생한 것으로 감지되는 경우, 오프라인 매장 연결까지 자연스럽게 이어지도록 지원합니다.

**DON'T**
- 이전 맥락을 재확인하거나 추가 입력을 요구하여 고객이 다시 시작하도록 만들지 않습니다.

### Scenario — 상황별 적용 방식

| 채널 전환 시나리오 | 전환 조건 | 전환 후 표시 내용 |
|---|---|---|
| 앱 → 오프라인 매장 | `task_difficulty_detected == true` | 매장에서 "IMEI 입력 단계부터 개통 진행" 표시 |
| 온라인 → 오프라인 | 사용자 요청 또는 시스템 감지 | 스마트플래너 데이터 연동 + 진행 단계 동기화 |

[IMAGE_REQUIRED: RSV_2_scenario_app_to_store_transfer_mockup]
[IMAGE_REQUIRED: RSV_2_scenario_context_preserved_transfer_mockup]

---

## UXL_RSV_3 — 인텐트 기반 실시간 상담 가이드

### 개요

고객의 현재 상태와 상담 맥락(발화, 인텐트)을 실시간으로 분석하여 상담에 필요한 메뉴와 대응 정보를 즉시 제공하고, 처리 시 후속 업무까지 선제적으로 연결하여 재문의 없는 해결 방안을 제공해야 합니다.

### BEHAVIOR

고객은 상담 중 필요한 정보를 확인한 뒤 다음 행동을 스스로 판단하고 별도의 단계로 이동해 문제를 해결합니다.

### AS-IS (문제 상황)

상담 과정에서 정보 제공과 실행이 분리되어 있어 고객이 다음 행동을 결정해야 하며, 이로 인해 해결까지의 단계가 늘어나고 중간 이탈이 발생합니다.

### TO-BE (목표 상태)

고객의 발화 의도와 현재 상태를 실시간으로 해석하여 필요한 정보와 실행 태스크를 함께 제시하고, 후속 조치까지 연결해야 합니다. 정보 제공에 그치지 않고, 즉시 실행까지 이어지는 해결 흐름을 완성해야 합니다.

### RULE 1

고객의 발화 의도와 상태를 실시간으로 해석하여, 필요한 정보와 실행 태스크를 후속 단계까지 끊김 없이 연결해야 합니다.

**DO**
- 상담 중 고객의 요청이 대화 안에서 바로 해결되도록 구성합니다.
- 즉시처리까지 완료 처리됩니다. (대화 흐름 내 완결)

**DON'T**
- 대화 중 별도 탐색을 유도하여 상담 흐름이 끊기거나, 고객이 직접 다음 행동을 찾도록 만들지 않습니다.

### Scenario — 상황별 적용 방식

| 발화 의도 | 인라인 처리 흐름 |
|---|---|
| "T 패스 해지하고 싶어요" | 환불 정보 인라인 표시 → 즉시/예약 선택 → 대화 내 완결 |
| 환불 확인 요청 | 환불 금액 + 이용기간 차감 내역 즉시 표시 |
| 연동 혜택 영향 문의 | "웨이브 이용과 메가커피 혜택은 함께 종료돼요" 자동 안내 |

**환불 정보 인라인 구조 (UXL_RSV_3 표준)**

| 항목 | 값 |
|---|---|
| 총 구독가 | ${subscription_price}원 |
| 이용 기간 차감 | -${usage_deduction}원 |
| 쿠폰 할인 차감 | ${coupon_deduction}원 |
| **최종 환불 금액** | **${final_refund_amount}원** |

[IMAGE_REQUIRED: RSV_3_scenario_intent_termination_inline_mockup]
[IMAGE_REQUIRED: RSV_3_scenario_refund_inline_display_mockup]
