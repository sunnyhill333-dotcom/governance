---
pattern_file: "UXL_ACT"
journey_code: "ACT"
journey_name: "실행/구매"
journey_description: "보유한 고객 데이터를 유기적으로 호출해 입력과 선택 단계를 정보 확인의 과정으로 전환함으로써, 사용자의 물리적인 수고를 제거하는 '제로 입력' 여정을 구현해야 합니다."
patterns:
  - pattern_id: "UXL_ACT_1"
    pattern_name: "입력/선택 간소화"
    screen_type: "checkout_step"
    trigger_data:
      - field: "checkout.stage"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "user_profile_data"
        source: "user_profile"
        required: true
      - key: "recent_delivery_address"
        source: "user_profile"
        required: false
      - key: "default_payment_method"
        source: "user_profile"
        required: false
      - key: "available_coupons"
        source: "user_profile"
        required: false
      - key: "available_points"
        source: "user_profile"
        required: false
      - key: "nearest_store"
        source: "real_time_api"
        required: false
    outputs:
      - component: "AutoFilledCheckoutForm"
        slot: "checkout_primary"
        condition: "always"
        state: "pre_filled"
    do:
      - "IF user_profile_data.name IS NOT NULL THEN auto-fill personal_info_field; set field_state = 'confirmed_editable'"
      - "IF recent_delivery_address IS NOT NULL THEN auto-select as delivery_address; display as '우리집' with edit option"
      - "IF default_payment_method IS NOT NULL THEN auto-select; display with edit option"
      - "IF available_coupons IS NOT NULL THEN auto-apply maximum_discount_combination; render '자동으로 최대 할인이 적용됐어요' label"
      - "IF available_points > 0 THEN auto-apply points_toward_payment"
      - "IF checkout_type == 'store_pickup' AND nearest_store IS NOT NULL THEN auto-select nearest_store as pickup_location"
    dont:
      - trigger: "user already has stored profile data"
        rejection: "present blank form requiring manual data re-entry"
        fallback: "pre-fill from user_profile_data with confirm-only UX"
      - trigger: "multiple coupon/discount options available"
        rejection: "present full coupon list for manual selection"
        fallback: "auto-apply maximum_discount_combination; show applied summary"
    copy_template:
      auto_fill_confirmation: "아래 정보로 주문을 진행할게요."
      delivery_auto_filled: "아래 주소로 배송해 드릴게요."
      payment_auto_filled: "이 결제수단으로 휴대폰 납부가 진행돼요."
      coupon_auto_applied: "자동으로 최대 할인이 적용됐어요."
      store_auto_selected: "현 위치와 가장 가까운 매장을 설정해 드렸어요."
    fallback_behavior:
      condition: "user_profile_data unavailable"
      render: "render empty checkout form with input prompts"

  - pattern_id: "UXL_ACT_2"
    pattern_name: "선제적 리스크 처리"
    screen_type: "checkout_step"
    trigger_data:
      - field: "action.risk_detected"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "action_type"
        source: "session_state"
        required: true
      - key: "penalty_calculation"
        source: "real_time_api"
        required: false
      - key: "refund_calculation"
        source: "real_time_api"
        required: false
      - key: "benefit_impact"
        source: "real_time_api"
        required: false
      - key: "process_stage_list"
        source: "real_time_api"
        required: true
    outputs:
      - component: "RiskAlertCard"
        slot: "checkout_pre_action"
        condition: "risk_detected == true"
        state: "visible"
      - component: "ProcessProgressIndicator"
        slot: "checkout_status"
        condition: "multi_step_process == true"
        state: "active"
    do:
      - "IF action.type == 'plan_change' AND billing_cycle_mid THEN show billing_impact_breakdown before confirmation"
      - "IF action.type == 'subscription_terminate' AND refund_available THEN show refund_breakdown inline before final confirmation"
      - "IF action.type == 'subscription_terminate' AND linked_benefits_affected THEN show linked_benefit_termination_notice"
      - "IF multi_step_process THEN render ProcessProgressIndicator showing completed/current/pending stages"
      - "IF penalty_amount == 0 THEN prominently show '위약금 없음' label"
    dont:
      - trigger: "risk exists"
        rejection: "reveal risk information only after action completion"
        fallback: "surface risk details before confirmation step"
      - trigger: "multi-step process running"
        rejection: "hide process stages from user"
        fallback: "render ProcessProgressIndicator with stage labels"
    copy_template:
      termination_risk_notice: "즉시해지를 선택하면 오늘 구독이 바로 종료돼요. 환불 예상 금액을 먼저 확인해 주세요."
      refund_breakdown_label: "최종 환불 금액은 ${refund_amount}원으로 이용 기간을 차감 계산된 금액이고, ${linked_benefit_name} 이용과 ${coupon_name} 혜택은 함께 종료돼요."
      plan_change_billing: "월 중 변경 시 요금과 데이터가 일할 계산돼요."
      no_penalty: "바로 변경해도 위약금이 발생하지 않아요."
      next_month_apply: "다음 달 1일부터 적용하는 것을 추천드려요. 추가로 납부해야 할 위약금은 없어요."
      process_stage_labels:
        - "해지 신청 접수"
        - "이용 내역 확인"
        - "해지 처리"
      process_completed: "즉시해지가 완료됐어요. 환불 금액은 결제수단 계좌로 입금 예정이에요. 입금이 완료되면 다시 알려드릴게요."
    fallback_behavior:
      condition: "risk_calculation unavailable"
      render: "render action_confirmation without risk breakdown; append 'calculating...' label"
---

# UXL_ACT — 실행/구매 (Action)

> **검수 목적**: 고객이 구매·변경·해지 등의 실행 단계에서 입력 부담 없이 완료할 수 있는 화면을 AI가 일관되게 재현하기 위한 Single Source of Truth.

---

## UXL_ACT_1 — 입력/선택 간소화

### 개요

보유한 고객 데이터를 유기적으로 호출해 입력과 선택 단계를 정보 확인의 과정으로 전환함으로써, 사용자의 물리적인 수고를 제거하는 '제로 입력' 여정을 구현해야 합니다.

### BEHAVIOR

고객은 가입, 변경, 구매 과정에서 동일한 정보를 반복 입력하고 각 단계별로 옵션을 직접 선택합니다. 입력 오류와 재확인 과정이 반복되며 진행이 지연되거나 중단됩니다.

### AS-IS (문제 상황)

고객 데이터를 활용하지 않아 입력과 선택 과정이 유지되고 있습니다. 이로 인해 물리적 피로와 이탈 가능성이 증가합니다.

### TO-BE (목표 상태)

고객 데이터를 자동 호출하여 입력과 선택 단계를 축소하고, 고객이 정보 확인만으로 진행할 수 있는 구조로 전환해야 합니다. 입력은 선택이 아닌 시스템이 선제 수행해야 하는 영역이 되어야 합니다.

### RULE 1

고객 데이터를 자동 반영해 고객이 확인만으로 진행할 수 있는 구조를 제공합니다.

**DO**
- 가입 정보, 배송지, 결제수단 등 입력과 선택사항이 많은 주문 과정의 경우, 기본 정보를 자동으로 채워오거나, 최적안(금액, 최근 이력 기준)을 자동으로 선택해 고객의 확인만으로 넘어갈 수 있게 해야 합니다.

**DON'T**
- 이미 가진 정보를 다시 입력하게 하거나 입력 과정을 반복시키지 않습니다.

### Scenario — 상황별 적용 방식

| 입력 항목 | 자동 처리 방식 | 표시 형태 |
|---|---|---|
| 가입 정보 | 고객 프로필에서 자동 호출 | 확인 가능한 pre-filled 폼 |
| 배송지 | 최근 배송지 자동 선택 | "우리집" 레이블 + 변경 옵션 |
| 결제수단 | 기본 결제수단 자동 선택 | 카드명 표시 + 변경 옵션 |
| 쿠폰/포인트 | 최대 할인 조합 자동 적용 | "자동으로 최대 할인이 적용됐어요" |
| 방문 매장 | 현 위치 기반 최근접 매장 자동 설정 | 매장명 + 일시 pre-filled |

[IMAGE_REQUIRED: ACT_1_scenario_autofill_order_mockup]
[IMAGE_REQUIRED: ACT_1_scenario_coupon_auto_apply_mockup]

---

## UXL_ACT_2 — 선제적 리스크 처리

### 개요

발생할 수 있는 리스크와 유의 사항을 시스템이 선제적으로 감지해 명확히 안내함으로써, 고객이 심리적 부담 없이 과업을 처리할 수 있도록 설계해야 합니다.

### BEHAVIOR

고객은 위약금, 조건 변경, 불이익 등의 리스크를 사후에 인지하거나 직접 확인하려고 합니다. 불확실성이 존재할 경우 실행을 보류합니다.

### AS-IS (문제 상황)

리스크 정보가 분산되어 있거나 사전에 안내되지 않아 고객이 심리적 불안을 느끼고 의사결정을 미루게 됩니다.

### TO-BE (목표 상태)

시스템이 리스크를 사전에 감지하고, 명확한 영향 범위를 선제적으로 안내해야 합니다. 고객이 불안 없이 즉시 실행할 수 있는 상태를 만들어야 합니다.

### RULE 1

실행 이전 단계에서 리스크를 감지해 사전에 안내해야 합니다.

**DO**
- 액션 전에 발생 가능한 리스크와 영향을 미리 식별해 명확히 안내합니다.
- 현재 상황을 인지할 수 있도록 절차를 명확히 드러내야 합니다.
- 진행 단계와 상태를 가시화해 고객이 현재 위치를 명확히 이해할 수 있도록 합니다.

**DON'T**
- 리스크를 숨기거나 실행 이후에 인지되도록 방치하지 않습니다.
- 절차를 숨기거나 현재 상태를 파악하기 어렵게 구성하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 리스크 유형 | 선제 안내 내용 |
|---|---|---|
| 요금제 변경 (월 중) | 일할 계산 요금 변화 | "월 중 변경 시 요금과 데이터가 일할 계산돼요." + 적용 시점 선택 |
| 구독 즉시 해지 | 환불 금액 + 연동 혜택 종료 | 환불 예상 금액 + "웨이브·메가커피 혜택은 함께 종료돼요" |
| 다단계 처리 진행 중 | 단계 완료 여부 불명확 | ProcessProgressIndicator (해지신청접수 → 이용내역확인 → 해지처리) |

[IMAGE_REQUIRED: ACT_2_scenario_plan_change_risk_mockup]
[IMAGE_REQUIRED: ACT_2_scenario_termination_refund_mockup]
[IMAGE_REQUIRED: ACT_2_scenario_process_progress_mockup]
