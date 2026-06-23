---
pattern_file: "UXL_EXP"
journey_code: "EXP"
journey_name: "탐색"
journey_description: "이용 맥락과 행동 데이터에 따라 콘텐츠를 동적으로 노출해 탐색 수고를 덜고, 맞춤형 카피를 적용해 오퍼링이 거부감 없이 자연스러운 혜택으로 와닿게 해야 합니다."
patterns:
  - pattern_id: "UXL_EXP_1"
    pattern_name: "맥락 기반 유동적 전시"
    screen_type: "explore_list"
    trigger_data:
      - field: "user.context_type"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "usage_context"
        source: "real_time_api"
        required: true
      - key: "behavior_history"
        source: "user_profile"
        required: true
      - key: "realtime_location"
        source: "real_time_api"
        required: false
      - key: "time_of_day"
        source: "real_time_api"
        required: false
    outputs:
      - component: "ContentList"
        slot: "explore_primary"
        condition: "always"
        state: "personalized_ordered"
    do:
      - "IF user.context_type == 'device_priority' THEN render device_list as first ContentList block"
      - "IF user.context_type == 'subscription_priority' THEN render subscription_list as first ContentList block"
      - "IF user.context_type == 'bundle_priority' THEN render bundle_list as first ContentList block"
      - "IF time_of_day == 'evening' AND user.has_dining_benefit THEN render personalized dining offer with contextual copy"
      - "IF realtime_location.nearby_coupon_count > 0 THEN render nearby_coupon_card with count label"
      - "IF user.recently_viewed_device IS NOT NULL THEN render similar_device_recommendation_card"
    dont:
      - trigger: "multiple content types available"
        rejection: "render identical content order for all users"
        fallback: "render user.context_type-prioritized order"
      - trigger: "marketing banner required"
        rejection: "apply uniform copy to all user segments"
        fallback: "apply segment-specific copy per user.segment_id"
    copy_template:
      device_priority_headline: "이번주 가장 많이 팔린 단말기예요."
      subscription_priority_headline: "T에서만 누릴 수 있는 구독혜택을 확인해보세요."
      bundle_priority_headline: "결합하면 매달 나가는 통신비를 줄여요."
      time_based_offer: "야식 먹을 시간, ${offer.merchant} ${offer.discount_desc} 드실 수 있어요."
      location_based_offer: "근처 주울 수 있는 쿠폰이 ${nearby_coupon_count}개 있어요. 놓치기 전에 주워보세요!"
      device_recommendation: "갤럭시 S29 울트라 확인하셨네요. 비슷한 모델과 더 저렴한 요금제를 추천드려요."
    fallback_behavior:
      condition: "usage_context AND behavior_history both unavailable"
      render: "render default_popular_content_list ordered by platform_ranking"

  - pattern_id: "UXL_EXP_2"
    pattern_name: "혜택 통합 제공 및 가치 체감"
    screen_type: "explore_list"
    trigger_data:
      - field: "user.benefit_portfolio"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "membership_points"
        source: "user_profile"
        required: true
      - key: "available_coupons"
        source: "user_profile"
        required: true
      - key: "subscription_status"
        source: "user_profile"
        required: true
      - key: "usage_pattern"
        source: "user_profile"
        required: true
    outputs:
      - component: "BenefitDashboard"
        slot: "benefit_hub"
        condition: "user.has_any_benefit == true"
        state: "integrated_view"
    do:
      - "IF user.has_multiple_benefit_types THEN render unified BenefitDashboard combining points, coupons, subscriptions"
      - "IF benefit.value_type == 'abstract' THEN convert to concrete_value_expression (e.g. '커피 1잔', '영화 티켓 2매')"
      - "IF user.unused_points > 0 AND auto_payment_not_set THEN render AutoPaymentBenefitCard with projected_annual_saving"
      - "IF benefit_applicable_now THEN surface highest_priority_benefit at top of BenefitDashboard"
    dont:
      - trigger: "multiple benefit types available"
        rejection: "scatter benefits across separate feature screens"
        fallback: "consolidate all benefit types into single BenefitDashboard"
      - trigger: "benefit value display required"
        rejection: "show raw numeric value without real-world context"
        fallback: "convert to daily-life equivalent (e.g. '매달 31,760원의 가치')"
    copy_template:
      benefit_integration_headline: "${user.name}님, 아래 혜택 ${missing_benefit_count}개만 확인해서 등급 올리면 ${additional_saving_amount}원 더 아낄 수 있어요."
      value_conversion: "혜택이 커피 1잔에서 영화 티켓 2매만큼 커져요."
      unused_points_alert: "수진님은 매달 ${monthly_point_accrual}P가 적립되지만 최근 3개월간 거의 사용되지 않았어요. 자동 납부를 설정하면 매월 최대 ${max_monthly_discount}P가 요금에서 차감돼 연간 최대 ${annual_saving}원까지 절약할 수 있어요."
      benefit_applied_confirmation: "이제 매달 ${total_benefit_value}원의 가치를 더 돌려받을 수 있어요."
    fallback_behavior:
      condition: "benefit_portfolio unavailable"
      render: "render generic_benefit_discovery_card"
---

# UXL_EXP — 탐색 (Explore)

> **검수 목적**: 고객의 이용 맥락과 행동 데이터에 따라 콘텐츠 순서와 카피가 동적으로 재구성되는 화면을 AI가 일관되게 재현하기 위한 Single Source of Truth.

---

## UXL_EXP_1 — 맥락 기반 유동적 전시

### 개요

이용 맥락과 행동 데이터에 따라 콘텐츠를 동적으로 노출해 탐색 수고를 덜고, 맞춤형 카피를 적용해 오퍼링이 거부감 없이 자연스러운 혜택으로 와닿게 해야 합니다.

### BEHAVIOR

고객은 동일한 리스트 구조에서 다양한 콘텐츠를 탐색하며 자신에게 필요한 상품과 혜택을 직접 선별합니다. 현재 상황과 무관한 정보 속에서 필요한 정보를 찾기 위해 반복적인 스크롤과 탐색을 수행합니다.

### AS-IS (문제 상황)

요금제, 이용 패턴, 직전 행동 등 실시간 맥락이 반영되지 않아 모든 고객에게 동일한 콘텐츠 구조가 제공됩니다. 이로 인해 현재 필요하지 않은 정보까지 소비하게 되며 탐색 피로가 증가합니다.

### TO-BE (목표 상태)

고객의 현재 상황과 행동 데이터를 기반으로 콘텐츠 노출 순서를 동적으로 재구성해야 합니다. 동시에 고객 맥락에 맞는 카피를 함께 제공해 오퍼링이 자연스럽게 인지되도록 설계해야 합니다.

### RULE 1

고객의 이용 맥락에 따라 콘텐츠 노출 순서를 동적으로 재구성해야 합니다.

**DO**
- 고객의 상황 맥락을 반영해 선호도 기준으로 콘텐츠를 우선 노출합니다.

**DON'T**
- 모든 고객에게 동일한 콘텐츠 순서를 고정 제공하지 않습니다.

### RULE 2

고객 맥락을 반영해 콘텐츠 내용을 맞춤형으로 제공합니다.

**DO**
- 시간, 위치, 관심사 등 고객의 상황과 활동 데이터가 학습된 경우, 그에 해당하는 개인화 콘텐츠를 생성해 노출해야 합니다.
- 노출 우선순위가 높은 오퍼링 배너의 경우에도, 개별 고객 세그먼트에 따라 상이한 카피를 활용해 마케팅이 이뤄져야 합니다.

**DON'T**
- 맥락과 무관한 메시지와 콘텐츠만 반복 노출하지 않습니다.

### Scenario — 상황별 적용 방식

#### 콘텐츠 우선순위 재구성

| 시나리오 | 트리거 조건 | 첫 번째 ContentBlock |
|---|---|---|
| 단말기 우선 | `user.context_type == 'device_priority'` | 인기 단말기 리스트 |
| 구독 상품 우선 | `user.context_type == 'subscription_priority'` | 구독 상품 리스트 |
| 결합 상품 우선 | `user.context_type == 'bundle_priority'` | 결합 상품 리스트 |

[IMAGE_REQUIRED: EXP_1_scenario_device_priority_mockup]
[IMAGE_REQUIRED: EXP_1_scenario_subscription_priority_mockup]
[IMAGE_REQUIRED: EXP_1_scenario_bundle_priority_mockup]

#### 상황 맥락 기반 카피 변경

| 시나리오 | 트리거 조건 | 카피 |
|---|---|---|
| 시간 기반 | `time_of_day == 'evening' AND user.dining_benefit_available` | "야식 먹을 시간, 도미노 피자를 무료로 드실 수 있어요." |
| 위치 기반 | `nearby_coupon_count > 0` | "근처 주울 수 있는 쿠폰이 {N}개 있어요. 놓치기 전에 주워보세요!" |
| 관심사 기반 (40대 주부) | `user.segment == '40대주부'` | 가족 혜택·생활 편의 중심 카피 |
| 관심사 기반 (20대 대학생) | `user.segment == '20대대학생'` | 데이터·엔터테인먼트 중심 카피 |

[IMAGE_REQUIRED: EXP_1_scenario_time_based_mockup]
[IMAGE_REQUIRED: EXP_1_scenario_location_based_mockup]
[IMAGE_REQUIRED: EXP_1_scenario_segment_40s_mockup]
[IMAGE_REQUIRED: EXP_1_scenario_segment_20s_mockup]

---

## UXL_EXP_2 — 혜택 통합 제공 및 가치 체감

### 개요

이벤트, 멤버십과 혜택을 묶어 통합된 구조로 제공하고, 맞춤형 참여 독려와 가치 체감으로 이어지는 완결된 혜택 경험을 제공해야 합니다.

### BEHAVIOR

고객은 이벤트, 멤버십, 할인 혜택을 각각 개별적으로 확인하며 적용 가능한 혜택을 직접 조합합니다. 혜택 활용 과정에서 누락과 중복 확인이 발생합니다.

### AS-IS (문제 상황)

혜택이 분산되어 제공되어 전체 가치가 직관적으로 전달되지 않습니다. 고객은 자신이 받을 수 있는 총 혜택을 체감하기 어렵습니다.

### TO-BE (목표 상태)

분산된 혜택을 통합된 구조로 묶어 고객에게 제공해야 합니다. 고객이 혜택 전체를 이해하고 참여까지 이어질 수 있는 완결된 경험을 가져야 합니다.

### RULE 1

분산된 혜택을 통합된 구조로 제공해야 합니다.

**DO**
- 혜택을 하나의 화면에서 전체 가치가 보이도록 통합 제공합니다.
- 바코드, 포인트, 쿠폰, 구독 등 상이한 유형의 혜택을 하나의 화면으로 통합한 대시보드형 구조로 관리할 수 있어야 합니다.
- 고객이 여러 유형의 혜택을 보유한 경우에도, 현 상황에 가장 적합한 혜택을 상위로 제안해 빠른 혜택 사용을 도와야 합니다.

**DON'T**
- 혜택을 개별 기능으로 분산해 고객이 직접 찾아 사용하도록 하지 않습니다.

### RULE 2

혜택은 체감 가능한 형태로 제공해야 합니다.

**DO**
- 금액, 절감 효과 등 실생활에서 바로 이해할 수 있는 가치로 혜택을 변환해 제공합니다.
- 고객에게 상품 신규·상향 가입을 제안하는 경우, '커피 1잔', '영화 티켓 2매' 등 일상 용어로 가치를 쉽게 체감시켜야 합니다.
- 요금제·결합 상품 변경을 통해 고객이 금전적으로 이득을 볼 수 있는 경우, '매달 O원 절약, 돌려받을 가치'로 표현을 강조해 체감시켜야 합니다.

**DON'T**
- 추상적인 혜택 설명이나 조건 중심 정보만으로 고객이 직접 해석하도록 하지 않습니다.

### RULE 3

혜택 적용과 참여를 하나의 흐름으로 연결해야 합니다.

**DO**
- 혜택 확인부터 적용, 후속 참여까지 끊김 없이 연속된 행동 흐름으로 이어줍니다.

**DON'T**
- 혜택 적용 이후 다음 행동이 단절되도록 구성하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 트리거 조건 | 노출 내용 |
|---|---|---|
| 혜택 통합 대시보드 | `user.has_multiple_benefit_types == true` | BenefitDashboard: 포인트 + 쿠폰 + 구독 통합 |
| 미사용 포인트 자동납부 | `user.unused_points > 0 AND auto_payment_disabled` | 자동납부 설정 시 연간 절약액 표시 |
| 가치 체감형 혜택 제안 | `plan_upgrade_eligible == true` | "매달 {N}원 아낄 수 있어요" + 일상 용어 환산 |
| 혜택 적용 후속 연결 | `benefit_applied == true` | "이제 매달 {value}원의 가치를 더 돌려받을 수 있어요." + 다음 행동 CTA |

[IMAGE_REQUIRED: EXP_2_scenario_benefit_dashboard_mockup]
[IMAGE_REQUIRED: EXP_2_scenario_unused_points_mockup]
[IMAGE_REQUIRED: EXP_2_scenario_value_conversion_mockup]
[IMAGE_REQUIRED: EXP_2_scenario_benefit_followup_mockup]
