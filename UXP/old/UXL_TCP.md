---
pattern_file: "UXL_TCP"
journey_code: "TCP"
journey_name: "완료"
journey_description: "고객이 과업을 완료한 이후 처리 결과를 직관적으로 인지하고, 핵심 정보를 시각화해 전달하며, 후속 조치를 선제적으로 안내합니다."
patterns:
  - pattern_id: "UXL_TCP_1"
    pattern_name: "종합적인 처리 결과 안내"
    screen_type: "task_complete"
    trigger_data:
      - field: "task.completion_status"
        operator: "eq"
        value: "completed"
    inputs:
      - key: "completed_task_type"
        source: "session_state"
        required: true
      - key: "task_result_summary"
        source: "real_time_api"
        required: true
    outputs:
      - component: "TaskCompletionSummary"
        slot: "completion_primary"
        condition: "task.completion_status == 'completed'"
        state: "result_unified"
    do:
      - "IF task.completion_status == 'completed' THEN render single unified TaskCompletionSummary (not per-step messages)"
      - "IF task_type == 'plan_change' THEN render: new_plan_name, new_monthly_fee, data_allowance, included_benefits"
      - "IF task_type == 'data_gift' THEN render: recipient_name, gifted_data_amount, remaining_gift_count_this_month"
      - "IF task_type == 'point_payment_schedule' THEN render: target_member, target_plan, scheduled_point_amount, schedule_end_date"
      - "IF task_type == 'agent_task_request' THEN render: request_confirmation + pending_items"
    dont:
      - trigger: "multi-step task completed"
        rejection: "show individual step completion messages in sequence"
        fallback: "consolidate all step results into single unified completion summary"
    copy_template:
      plan_change_complete: "요금제가 변경됐어요."
      plan_change_saving: "이제 ${user.name}님은 매달 ${saving_amount}원의 가치를 더 돌려받을 수 있어요."
      data_gift_complete: "${data_amount}GB 데이터 선물을 완료했어요."
      data_gift_followup: "이번달 현숙님께 데이터를 두 차례 전송하셨어요. 데이터 사용량이 많으신 경우, 요금제 변경을 고려해 보세요."
    fallback_behavior:
      condition: "task_result_summary unavailable"
      render: "render generic_completion_message with task_type label"

  - pattern_id: "UXL_TCP_2"
    pattern_name: "핵심 정보 시각화"
    screen_type: "task_complete"
    trigger_data:
      - field: "task.completion_status"
        operator: "eq"
        value: "completed"
    inputs:
      - key: "usage_data"
        source: "real_time_api"
        required: false
      - key: "benefit_delta"
        source: "real_time_api"
        required: false
      - key: "comparison_data"
        source: "real_time_api"
        required: false
    outputs:
      - component: "UsageVisualization"
        slot: "completion_data_section"
        condition: "usage_data IS NOT NULL"
        state: "chart_rendered"
      - component: "BenefitDeltaCard"
        slot: "completion_benefit_section"
        condition: "benefit_delta IS NOT NULL"
        state: "delta_shown"
    do:
      - "IF usage_data available THEN render bar/donut chart segmented by usage_category (e.g. content_OTT, social, communication)"
      - "IF comparison_data available THEN render before_after device/plan comparison using image or structured table"
      - "IF benefit_delta available THEN convert to concrete_value (e.g. '매달 {N}원 아낄 수 있어요')"
    dont:
      - trigger: "usage or benefit data available"
        rejection: "display raw numbers in list form requiring user interpretation"
        fallback: "render visual chart or delta card with concrete value conversion"
      - trigger: "completion page rendered"
        rejection: "use explanatory sentence blocks for numeric data"
        fallback: "use chart visualization or structured comparison layout"
    copy_template:
      data_usage_chart_label: "콘텐츠/OTT {usage_pct}%, 주간평균사용시간 {weekly_avg_hours}시간"
      saving_value_conversion: "넷플릭스 볼 때 데이터를 가장 많이 쓰시니까 이 요금제가 훨씬 합리적이에요."
      comparison_headline: "갤럭시 {model_name} {storage}GB와 지금 사용 중인 휴대폰의 납부액을 자세히 비교해 드릴게요."
    fallback_behavior:
      condition: "visualization_data unavailable"
      render: "render text-based completion summary without chart"

  - pattern_id: "UXL_TCP_3"
    pattern_name: "사후 가이드 제공"
    screen_type: "task_complete"
    trigger_data:
      - field: "task.completion_status"
        operator: "eq"
        value: "completed"
    inputs:
      - key: "completed_task_type"
        source: "session_state"
        required: true
      - key: "followup_actions"
        source: "real_time_api"
        required: true
    outputs:
      - component: "FollowUpActionList"
        slot: "completion_followup"
        condition: "followup_actions IS NOT NULL"
        state: "proactive"
    do:
      - "IF task_type == 'device_activation' AND account_link_required THEN show account_link_cta ('유튜브 프리미엄 계정 연동이 필요해요.')"
      - "IF task_type == 'device_activation' THEN show data_migration_offer ('사진, 연락처 등을 새 휴대폰으로 한 번에 옮겨볼까요?')"
      - "IF task_type == 'data_gift' AND recipient_usage_high THEN show plan_upgrade_suggestion for recipient"
      - "IF task_type == 'plan_change' THEN show usage_optimization_followup or next_benefit_action"
    dont:
      - trigger: "task completed"
        rejection: "show only completion message with no subsequent guidance"
        fallback: "render FollowUpActionList with context-relevant next steps"
    copy_template:
      account_link_needed: "가입이 완료됐어요. 이어서 ${service_name} 계정 연동이 필요해요."
      data_migration_offer: "사진, 연락처, 데이터를 새 휴대폰으로 한 번에 옮겨볼까요?"
      data_gift_followup: "이번 달에 ${recipient_name}님께 데이터를 두 차례 전송하셨어요. 데이터 사용량이 많으신 경우, 상위 요금제로 변경을 고려해 보세요."
      member_plan_recommendation: "어머니 사용 패턴에 맞는 요금제를 추천해드릴까요?"
    fallback_behavior:
      condition: "followup_actions unavailable"
      render: "render completion page without followup section"
---

# UXL_TCP — 완료 (Task Complete)

> **검수 목적**: 과업 완료 직후 처리 결과를 통합 제공하고 후속 행동을 선제 안내하는 화면을 AI가 일관되게 재현하기 위한 Single Source of Truth.

---

## UXL_TCP_1 — 종합적인 처리 결과 안내

### 개요

고객이 처리 내역을 직관적으로 인지하도록, 지표 중심의 시각화와 후속 가이드를 제공해야 합니다.

### BEHAVIOR

고객은 여러 단계를 거쳐 과업을 완료한 뒤에도 각각의 처리 결과를 개별적으로 확인하며 전체 상태를 재구성하려 합니다. 결과가 분절되어 제공되기 때문에 전체 변화 맥락을 스스로 조합해야 하며, 완료 이후에도 이해를 위한 추가 탐색이 발생합니다.

### AS-IS (문제 상황)

단계별 완료 메시지가 나열되어 있어 고객이 직접 전체 흐름을 조합해야 합니다.

### TO-BE (목표 상태)

시스템이 모든 처리 결과를 하나의 결과 흐름으로 재구성하여 제공함으로써, 고객이 추가 해석 없이 완료 상태를 직관적으로 인지하도록 만들어야 합니다. 이는 단계 단위가 아닌 '결과 단위'로 정보를 통합해야 한다는 의미입니다.

### RULE 1

처리 내역은 단계 단위가 아닌 '하나의 결과 흐름'으로 통합 제공해야 합니다.

**DO**
- 여러 단계의 결과를 하나의 상태로 요약해 제공합니다.

**DON'T**
- 단계별 완료 메시지를 나열하여 고객이 직접 흐름을 조합하게 만들지 않습니다.

### Scenario — 상황별 적용 방식

| 태스크 유형 | 통합 완료 요약 구성 요소 |
|---|---|
| 요금제 변경 | 신규 요금제명 + 선택약정할인금액 + 공유데이터 + 기본제공혜택 + 결합상품 |
| 데이터 선물 | 선물한 데이터 용량 + 이번 달 남은 선물 횟수 |
| 포인트 요금 납부 예약 | 변경 대상자 + 변경 예정 요금제 + 납부 예약 포인트 + 자동납부 종료 예정일 |
| T Agent 예약 | 변경 대상 + 납부 방식 + 월 요금 변경 정보 |

[IMAGE_REQUIRED: TCP_1_scenario_plan_change_complete_mockup]
[IMAGE_REQUIRED: TCP_1_scenario_data_gift_complete_mockup]
[IMAGE_REQUIRED: TCP_1_scenario_point_payment_schedule_mockup]
[IMAGE_REQUIRED: TCP_1_scenario_agent_task_complete_mockup]

---

## UXL_TCP_2 — 핵심 정보 시각화

### 개요

설명 텍스트를 최소화하고, 고객이 알아야 할 혜택 변화와 주요 수치를 직접 시각화하여 고민 없이 변화된 가치를 파악하도록 제공해야 합니다.

### BEHAVIOR

고객은 완료 후 제공된 정보가 나열된 형태로 제공되면서 고객이 핵심 지표를 선별하고 해석하는 부담이 발생하고, 이는 의사결정의 피로로 이어집니다.

### AS-IS (문제 상황)

수치 나열과 설명 중심 문장으로 인해 고객이 직접 해석 과정을 거쳐야 합니다.

### TO-BE (목표 상태)

고객의 판단이 아닌 시스템의 해석 결과를 시각화하는 구조로, 고객이 실제로 체감할 수 있는 가치(비용 변화, 혜택 증감 등)와 핵심 정보만 구조적으로 시각화해야 합니다.

### RULE 1

고객이 읽는 즉시 의미를 이해할 수 있는 표현과 형태로 변환합니다.

**DO**
- 데이터를 그래프 기반으로 시각화하여, 이용 패턴을 즉시 파악하도록 합니다.
- 이미지 기반 비교를 통해 변경 전·후의 차이를 직관적으로 인지할 수 있도록 합니다.

**DON'T**
- 설명 중심의 문장이나 수치 나열로 인해 고객이 해석 과정을 거치도록 만들지 않습니다.

### Scenario — 상황별 적용 방식

| 데이터 유형 | 시각화 방식 |
|---|---|
| 데이터 사용량/빈도 | 카테고리별 막대/도넛 차트 |
| 주간 평균 사용 시간 (서비스) | 서비스별 사용 시간 시각화 |
| 요금제 혜택 조합 | 현재/변경 요금제 혜택 구성 비교 카드 |
| 단말기 납부액 비교 | 현재 기기 vs 신규 기기 납부액 이미지 비교 |

[IMAGE_REQUIRED: TCP_2_scenario_usage_chart_mockup]
[IMAGE_REQUIRED: TCP_2_scenario_weekly_service_time_mockup]
[IMAGE_REQUIRED: TCP_2_scenario_plan_benefit_comparison_mockup]
[IMAGE_REQUIRED: TCP_2_scenario_device_payment_comparison_mockup]

---

## UXL_TCP_3 — 사후 가이드 제공

### 개요

완료 후에도 필요한 후속 조치나 유의 사항을 선제적으로 안내하여, 불필요한 재탐색 없이 경험을 마무리해야 합니다.

### BEHAVIOR

고객은 과업 완료 이후 추가로 필요한 행동이나 주의사항을 확인하기 위해 다시 탐색하거나 문의합니다.

### AS-IS (문제 상황)

완료 이후의 상태 변화에 대한 안내가 부족하여 고객이 다음 행동을 스스로 판단해야 하며, 이로 인해 불필요한 재탐색이 발생합니다.

### TO-BE (목표 상태)

고객의 의도를 다시 읽고 다음 태스크를 이어서 시스템이 선제적으로 안내해야 합니다.

### RULE 1

완료 이후 필요한 후속 행동을 고객 탐색 없이 시스템이 선제적으로 제시해야 합니다.

**DO**
- 고객 상황을 기반으로 다음 행동과 유의사항을 함께 안내하여 경험을 이어줍니다.
- 상담이 완료된 경우, 해결된 상태를 기준으로 다음 단계에서 이어져야 할 후속 태스크를 자동으로 연결해 제공합니다.
- 고객이 특정 태스크를 수행한 경우, 이후 진행하면 좋은 다음 단계를 고객이 인지하지 못하는 상황이 없도록 선제적으로 안내합니다.

**DON'T**
- 완료 메시지만 제공하고 이후 행동을 고객이 스스로 판단하도록 방치하지 않습니다.

### Scenario — 상황별 적용 방식

| 완료 태스크 | 후속 안내 내용 |
|---|---|
| 개통 완료 | "이어서 유튜브 프리미엄 계정 연동이 필요해요." + CTA: 연동하러 가기 |
| 개통 완료 | "사진, 연락처, 데이터를 새 휴대폰으로 한 번에 옮겨볼까요?" + CTA |
| 데이터 선물 (반복) | "어머니 사용 패턴에 맞는 요금제를 추천해드릴까요?" |
| T 패스 가입 | 다음 결제일 안내 + 혜택 사용 방법 안내 |

[IMAGE_REQUIRED: TCP_3_scenario_activation_followup_mockup]
[IMAGE_REQUIRED: TCP_3_scenario_data_gift_followup_mockup]
