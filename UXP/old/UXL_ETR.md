---
pattern_file: "UXL_ETR"
journey_code: "ETR"
journey_name: "진입"
journey_description: "고객이 Next Platform에 진입하는 첫 접점. 현재 상태와 직전 이용 맥락을 기반으로 선제적 UX를 제공."
patterns:
  - pattern_id: "UXL_ETR_1"
    pattern_name: "상태 기반 선제적 대응"
    screen_type: "home_entry"
    trigger_data:
      - field: "user.c360_state"
        operator: "is_not_null"
        value: ""
      - field: "user.behavior_intent"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "c360_data"
        source: "real_time_api"
        required: true
      - key: "behavior_intent_data"
        source: "real_time_api"
        required: true
      - key: "event_trigger"
        source: "real_time_api"
        required: false
    outputs:
      - component: "MicroTaskCard"
        slot: "home_hero"
        condition: "user.pending_action IS NOT NULL"
        state: "active"
    do:
      - "IF user.c360_state IS NOT NULL THEN render single executable micro-task as home primary element"
      - "IF event_trigger.type == 'data_gift_request' THEN render DataGiftCard in home_hero slot"
      - "IF user.contract_remaining_days < 7 THEN render ContractExpiryAlert in home_hero slot"
      - "IF user.benefit_usage_pending THEN render BenefitReminderCard in home_hero slot"
    dont:
      - trigger: "c360_data unavailable"
        rejection: "render generic home layout identical for all users"
        fallback: "render segment-default micro-task card"
      - trigger: "user.current_state unresolved"
        rejection: "display unrelated content in home_hero slot"
        fallback: "render most-probable task based on user.segment"
    copy_template:
      micro_task_headline: "${user.name}님, 필요한 것들만 모아봤어요"
      data_gift_copy: "자녀가 데이터 요청을 보냈어요."
      contract_expiry_copy: "약정 만료 ${contract_remaining_days}일 전, ${user.name}님은 지금 기기 변경하면 최대 ${max_discount_amount}원 할인받아요."
      benefit_reminder_copy: "지금 ${merchant_name} 결제 대기 중이신가요? 적립혜택 놓치지 마세요."
    fallback_behavior:
      condition: "c360_data AND behavior_intent_data both unavailable"
      render: "render segment_default_home_layout"

  - pattern_id: "UXL_ETR_2"
    pattern_name: "끊김 없는 여정 재개"
    screen_type: "home_entry"
    trigger_data:
      - field: "user.interrupted_task"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "task_history"
        source: "session_state"
        required: true
      - key: "task_step_stage"
        source: "session_state"
        required: true
      - key: "task_input_snapshot"
        source: "session_state"
        required: true
    outputs:
      - component: "ResumeTaskCard"
        slot: "home_secondary"
        condition: "user.interrupted_task IS NOT NULL"
        state: "resume_ready"
    do:
      - "IF user.interrupted_task IS NOT NULL THEN render ResumeTaskCard with task_step_stage and task_input_snapshot preserved"
      - "IF task_step_stage == 'device_selection' THEN render device thumbnail and 'option_select_cta' button"
      - "IF task_completed_recently THEN render FollowUpActionCard with next recommended step"
    dont:
      - trigger: "user re-enters app after task interruption"
        rejection: "clear task_input_snapshot or reset task_step_stage"
        fallback: "restore interrupted task from last saved state"
      - trigger: "interrupted_task exists"
        rejection: "render generic home without resume entry point"
        fallback: "render ResumeTaskCard in home_secondary slot"
    copy_template:
      resume_headline: "다음에 이어서 하시겠어요?"
      resume_subtitle: "지금까지 입력하신 정보를 자동으로 저장했어요."
      resume_cta: "이어서 주문하세요"
      followup_headline: "${task.completed_item} 주문 완료 후, 이어서 하면 좋은 것들이에요"
    fallback_behavior:
      condition: "task_history unavailable"
      render: "render home_entry without resume card"

  - pattern_id: "UXL_ETR_3"
    pattern_name: "일관된 맥락 인지 네비게이션"
    screen_type: "all_screens"
    trigger_data:
      - field: "navigation.current_screen"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "current_screen_id"
        source: "session_state"
        required: true
      - key: "gnb_active_tab"
        source: "session_state"
        required: true
    outputs:
      - component: "GNB"
        slot: "top_navigation"
        condition: "always"
        state: "context_aware"
    do:
      - "IF screen_type changes THEN maintain same GNB structure principle; update only active state indicator"
      - "IF gnb_active_tab == 'home' THEN render GNB_HOME variant"
      - "IF gnb_active_tab == 'benefits' THEN render GNB_BENEFITS variant"
      - "IF gnb_active_tab == 'explore' THEN render GNB_EXPLORE variant"
    dont:
      - trigger: "screen_type transition"
        rejection: "apply different GNB layout structure per screen"
        fallback: "apply unified GNB structure with context-specific active state"
    copy_template: {}
    fallback_behavior:
      condition: "current_screen_id unavailable"
      render: "render GNB_HOME as default"
---

# UXL_ETR — 진입 (Entry)

> **검수 목적**: 고객이 Next Platform에 처음 진입하는 시점에서 AI가 일관된 화면을 재현하기 위한 Single Source of Truth.

---

## UXL_ETR_1 — 상태 기반 선제적 대응

### 개요

진입 시점의 고객 데이터를 기반으로 상태를 진단해, 당장 확인이 필요한 알림이나 개인화된 맞춤 태스크를 최우선으로 노출해야 합니다.

### BEHAVIOR

고객은 앱 진입 시 전체 메뉴를 탐색하기보다 당장 필요한 기능이나 상태 확인부터 시도합니다.

### AS-IS (문제 상황)

진입 시 일반화된 홈 구조로 인해 고객은 자신의 상황과 무관한 정보 속에서 필요한 행동을 다시 찾아야 합니다.

### TO-BE (목표 상태)

C360 및 행동/의도 데이터 기반으로 현재 상황(이벤트, 사용 상태, 행동 트리거)을 즉시 해석하고, 고객별로 다른 우선순위의 마이크로 태스크를 선제적으로 노출해야 합니다. 이는 '고객의 의도를 기반으로 UX를 동적으로 재구성'하는 구조로 이어져야 합니다.

### RULE 1

시스템이 고객의 현재 상태를 해석하고 행동을 선제 제안하여 즉시 실행으로 이어지도록 해야 합니다.

**DO**
- 반드시 고객 데이터 기반으로 상태를 정의하고, 하나의 실행 가능한 단위로 제공해야 합니다.
- 고객 상태를 데이터 기반으로 정의하고, 우선순위에 따라 단일 실행 가능한 행동으로 재구성해 즉시 실행되도록 제공해야 합니다.

**DON'T**
- 고객의 현재 상태와 무관한 콘텐츠를 동일 구조로 노출하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 트리거 조건 | 홈 hero 노출 내용 |
|---|---|---|
| 요청받은 데이터 선물 | `event.type == 'data_gift_request'` | "자녀가 데이터 요청을 보냈어요." + CTA: 지금 바로 선물하기 |
| 약정 만료 임박 | `user.contract_remaining_days < 7` | "약정 만료 {N}일 전, {name}님은 지금 기기 변경하면 최대 {M}만원 할인받아요." + CTA: 기기변경 비교하기 |
| 혜택 사용 대기 | `user.pending_benefit_payment == true` | "지금 {merchant_name} 결제 대기 중이신가요? 적립혜택 놓치지 마세요." + CTA: 바코드 열기 |

[IMAGE_REQUIRED: ETR_1_scenario_data_gift_mockup]
[IMAGE_REQUIRED: ETR_1_scenario_contract_expiry_mockup]
[IMAGE_REQUIRED: ETR_1_scenario_benefit_reminder_mockup]

---

## UXL_ETR_2 — 끊김 없는 여정 재개

### 개요

이전에 완료하지 못했던 여정(구매, 개통, 혜택 활성화 등)이 있다면, 진입 첫 화면에서 해당 지점으로 바로 이어갈 수 있도록 직관적인 리마인드 경로를 제공해야 합니다.

### BEHAVIOR

고객은 구매, 개통, 혜택 활성화 등 중단된 작업을 다시 찾기 위해 여러 화면을 반복 탐색합니다.

### AS-IS (문제 상황)

이전 행동 맥락이 유지되지 않아 고객이 어디까지 진행했는지 기억에 의존해야 하며, 이탈 가능성이 높아집니다.

### TO-BE (목표 상태)

이전 행동 데이터와 태스크 단계(탐색-비교-결정-실행)를 기반으로 중단 지점을 정확히 복원하고, 진입 즉시 이어서 실행할 수 있는 단일 경로를 제공해야 합니다. 이는 고객의 끊김 없는 Intent 기반 Action 설계로 연결되어야 합니다.

### RULE 1

태스크는 고객의 이전 행동 맥락을 유지한 상태로 단일 진입점에서 탐색 없이 즉시 실행 가능하도록 복원해야 합니다.

**DO**
- 중단된 태스크는 반드시 단일 진입점으로 복원해야 합니다.
- 고객이 프로세스 중 이탈하더라도, 입력 및 선택 정보를 유지한 상태로 단계를 바로 이어서 진행할 수 있도록 해야 합니다.
- 고객의 여정이 완료된 직후인 경우, 상태를 안내하는 것에 그치지 않고 다음 단계로 자연스럽게 이어지는 후속 행동을 함께 제안해야 합니다.

**DON'T**
- 고객의 이전 행동 맥락은 삭제하거나 초기화하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 트리거 조건 | 홈 노출 내용 |
|---|---|---|
| 이어하기 | `task.interrupted_stage IN ['device_selection', 'plan_compare', 'checkout']` | "다음에 이어서 하시겠어요?" ResumeCard + CTA: 이어서 주문하세요 |
| 후속 행동 선제 제안 | `task.completed_recently == true` | 완료 태스크 기반 다음 추천 행동 카드 |

[IMAGE_REQUIRED: ETR_2_scenario_resume_task_mockup]
[IMAGE_REQUIRED: ETR_2_scenario_followup_action_mockup]

---

## UXL_ETR_3 — 일관된 맥락 인지 네비게이션

### 개요

채널이나 기능으로 전환하더라도 현재 위치와 맥락을 명확히 인지할 수 있는 직관적인 네비게이션을 제공해 안정적인 이용 환경을 구축해야 합니다.

### BEHAVIOR

고객은 이동이나 기능 전환 시 현재 위치와 맥락을 다시 해석하려고 시도합니다.

### AS-IS (문제 상황)

GNB 구조가 일관되지 않으면 고객은 각 화면마다 새롭게 이해해야 하며, 인지 부담이 누적됩니다.

### TO-BE (목표 상태)

서비스 유형이나 기능이 달라도 동일한 원리로 이해 가능한 구조를 유지하고, 현재 위치-상태-맥락을 항상 명확하게 드러내야 합니다. 이는 '고객이 상황을 해석하지 않아도 되는 환경'을 만드는 Frictionless Experience로 이어져야 합니다.

### RULE 1

모든 화면은 일관된 구조로 고객이 해석 없이 현재 위치와 상태를 즉시 인지할 수 있도록 설계해야 합니다.

**DO**
- 모든 화면은 동일한 구조 원리로 구성되어야 합니다.

**DON'T**
- 화면마다 각각 다른 UI 패턴을 구성하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | GNB 상태 | 노출 내용 |
|---|---|---|
| GNB_홈 | `gnb_active == 'home'` | 미소 님 + 혜택 카드 |
| GNB_액티브 | `gnb_active == 'benefits'` | 민선님에게 필요할 것 같은 상품들 |
| GNB_탐색 | `gnb_active == 'explore'` | 카테고리 + VIP Pick |

[IMAGE_REQUIRED: ETR_3_scenario_gnb_home_mockup]
[IMAGE_REQUIRED: ETR_3_scenario_gnb_benefits_mockup]
[IMAGE_REQUIRED: ETR_3_scenario_gnb_explore_mockup]
