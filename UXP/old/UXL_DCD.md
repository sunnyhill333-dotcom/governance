---
pattern_file: "UXL_DCD"
journey_code: "DCD"
journey_name: "결정"
journey_description: "요금제 사용량, 데이터 패턴, 단말 상태 등 개인별 이용 데이터를 종합적으로 분석하여 가장 유리한 최적안을 선제적으로 제안하고, 고객이 빠른 판단을 내릴 수 있도록 직관적인 근거 기반 비교 구조를 제공합니다."
patterns:
  - pattern_id: "UXL_DCD_1"
    pattern_name: "데이터 기반 최적안 도출"
    screen_type: "decision_compare"
    trigger_data:
      - field: "user.usage_pattern"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "usage_pattern"
        source: "user_profile"
        required: true
      - key: "contract_status"
        source: "user_profile"
        required: true
      - key: "device_status"
        source: "user_profile"
        required: false
      - key: "family_group_usage"
        source: "user_profile"
        required: false
    outputs:
      - component: "OptimalPlanCard"
        slot: "decision_primary"
        condition: "usage_pattern IS NOT NULL"
        state: "single_recommendation"
    do:
      - "IF usage_pattern AND contract_status resolved THEN render single OptimalPlanCard (not a list of equal options)"
      - "IF plan_change_no_penalty THEN append 'no_penalty_label' to OptimalPlanCard"
      - "IF saving_amount > 0 THEN render saving_label showing concrete monthly/annual saving value"
      - "IF device_change AND bundle_complex THEN render single pre-configured bundle recommendation"
    dont:
      - trigger: "multiple plan options exist"
        rejection: "render all options as equal list for user to choose from"
        fallback: "render single optimal plan with rationale"
      - trigger: "recommendation available"
        rejection: "omit saving_amount or benefit_change from display"
        fallback: "always include concrete value basis (saving amount, benefit delta)"
    copy_template:
      optimal_recommendation: "어머니는 매달 20일쯤 데이터가 소진되는 패턴이라, 요금제 변경 시 선물 없이도 충분히 사용할 수 있어요. ${plan_name} 요금제를 추천드리며, 결합 혜택에도 일부 변화가 있어요."
      bundle_recommendation: "님의 패턴에 맞게 최적 옵션을 설정해뒀어요. 민수님께 딱 맞는 옵션들로 제가 한 번에 세팅해 드릴게요."
      no_penalty_label: "바로 변경해도 위약금이 발생하지 않아요."
      saving_label: "추가 비용이 없는 이유를 알려드릴게요."
    fallback_behavior:
      condition: "usage_pattern unavailable"
      render: "render plan_selection_list with usage_input_prompt"

  - pattern_id: "UXL_DCD_2"
    pattern_name: "근거 기반 비교 제공"
    screen_type: "decision_compare"
    trigger_data:
      - field: "comparison.items"
        operator: "gt"
        value: "1"
    inputs:
      - key: "current_contract"
        source: "user_profile"
        required: true
      - key: "candidate_options"
        source: "real_time_api"
        required: true
      - key: "user_segment"
        source: "user_profile"
        required: true
    outputs:
      - component: "ComparisonView"
        slot: "decision_compare_area"
        condition: "always"
        state: "delta_focused"
    do:
      - "IF comparison required THEN render delta_view showing change_amount and change_direction (not raw values)"
      - "IF data_increase THEN render 'data +{N}GB' delta label"
      - "IF cost_decrease THEN render 'monthly -{N}원 절약' delta label"
      - "IF user_segment == 'value_type' THEN lead with concrete benefit upgrade description"
      - "IF user_segment == 'analysis_type' THEN lead with data-driven rationale"
      - "IF user_segment == 'relationship_type' THEN lead with group/family benefit changes"
      - "IF user_segment == 'senior' THEN use simplified language and larger change summary"
    dont:
      - trigger: "comparison displayed"
        rejection: "list raw individual item values without showing delta"
        fallback: "render delta comparison view with change indicators"
      - trigger: "comparison displayed"
        rejection: "omit selection rationale requiring user to calculate themselves"
        fallback: "include pre-computed rationale with system-selected basis"
      - trigger: "multiple user segments"
        rejection: "apply identical comparison layout to all segments"
        fallback: "apply user_segment-specific comparison presentation"
    copy_template:
      value_type_headline: "${user.name}님이 실제로 더 잘 쓰게 될 혜택부터 보여드릴게요."
      analysis_type_headline: "왜 요금제 변경이 필요한지 알려드릴게요."
      senior_headline: "안녕하세요, 어머님. 저는 T 에이전트입니다. 안심하고 이용하셔도 됩니다. 민선님께서 어머님께 맞는 요금제로 변경을 요청하셨어요."
      delta_saving_label: "매달 ${saving_amount}원 절약"
      delta_data_label: "데이터 ${data_delta}GB 늘어요"
      change_summary: "달라지는 점만 정리해봤어요."
      bundle_change_summary: "달라지는 그룹혜택만 정리해봤어요."
    fallback_behavior:
      condition: "current_contract unavailable"
      render: "render full product_specification_list without delta"
---

# UXL_DCD — 결정 (Decision)

> **검수 목적**: 고객이 최적 선택을 빠르게 결정할 수 있도록 AI가 일관된 비교·추천 화면을 재현하기 위한 Single Source of Truth.

---

## UXL_DCD_1 — 데이터 기반 최적안 도출

### 개요

요금제 사용량, 데이터 패턴, 단말 상태 등 개인별 이용 데이터를 종합적으로 분석하여 가장 유리한 최적안을 선제적으로 제안해야 합니다. 제안 시에는 사용량 적합도 등 핵심 근거를 반드시 함께 노출해야 합니다.

### BEHAVIOR

고객은 요금제, 혜택, 단말 상태 등을 각각 확인하며 스스로 최적안을 찾기 위해 여러 화면을 반복 탐색합니다. 또한 개인의 사용량이나 상황을 기준으로 판단하지 못하고 단편적인 정보에 의존하는 경향이 있습니다.

### AS-IS (문제 상황)

데이터가 존재함에도 불구하고 이를 종합적으로 해석하지 않아 개인화된 제안이 이루어지지 않습니다. 그 결과 고객은 자신에게 적합한 선택을 스스로 계산해야 하는 부담을 가지게 됩니다.

### TO-BE (목표 상태)

고객의 사용 패턴, 상황, 데이터를 입체적으로 해석하여 의도를 도출하고, 그 결과로 최적의 단일안을 선제적으로 제시해야 합니다. 이때 절감액, 체감 혜택 등 실질 가치 근거를 함께 제공하여 즉시 판단 가능한 상태를 만들어야 합니다.

### RULE 1

고객 데이터를 기반으로 단일 최적 안을 선별해 제안해야 합니다.

**DO**
- 고객의 사용 패턴, 상황, 데이터를 반영하여 결과를 우선 제시하고 고객 판단을 유도합니다.
- 고려해야 하는 조건이 많은 요금제 변경의 경우, 고객 데이터 기반의 단일 최적 옵션을 먼저 제시해야 합니다.
- 단말기 변경과 같이 상품 결합이 복잡한 경우, 결합 구성과 변화를 한눈에 이해할 수 있는 최적 구성을 제공해야 합니다.

**DON'T**
- 복수 옵션을 동등하게 나열하거나 고객이 직접 선택하도록 유도하지 않습니다.

### RULE 2

판단 결과를 이해할 수 있는 데이터 기반 근거가 함께 제공되어야 합니다.

**DO**
- 절감 금액, 혜택 변화 등 정량 근거를 포함해야 합니다.
- 혜택 이용과 같이 가치 판단이 필요한 경우, 혜택 가치를 실질적인 금액이나 공감할 수 있는 표현으로 제공해야 합니다.
- 고객이 충분히 이해하고 선택을 증명하는 맞춤 안내를 명확히 제공해야 합니다.

**DON'T**
- 근거 없이 결과만 제시하거나 고객의 추가 계산·비교를 유도하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 트리거 조건 | 표시 내용 |
|---|---|---|
| 요금제 변경 권고 | `usage_pattern.data_exhaustion_day < 25` | 단일 최적 요금제 + 절감액 + 위약금 없음 레이블 |
| 복잡한 단말+요금 결합 | `cart.has_device AND cart.has_plan` | 결합 최적 구성 + 추가 비용 없는 이유 설명 |

[IMAGE_REQUIRED: DCD_1_scenario_plan_recommendation_mockup]
[IMAGE_REQUIRED: DCD_1_scenario_device_bundle_recommendation_mockup]

---

## UXL_DCD_2 — 근거 기반 비교 제공

### 개요

수많은 옵션 나열 대신 추천 근거를 바탕으로 현재 계약과의 차이를 직관적으로 대조해, 탐색 부담 없이 빠른 판단이 가능한 구조를 제공해야 합니다.

### BEHAVIOR

고객은 다양한 요금제와 상품이 나열된 상태에서 비교하며, 각 항목을 직접 계산하거나 기억해가며 판단합니다. 비교 과정에서 반복 탐색과 재확인을 수행합니다.

### AS-IS (문제 상황)

동일한 나열 구조로 인해 고객이 스스로 비교 기준을 만들어야 하며, 현재 상태 대비 변화(비용, 혜택, 영향)를 직관적으로 파악하기 어렵습니다. 이는 결정 지연과 이탈로 이어집니다.

### TO-BE (목표 상태)

현재 계약 상태를 기준으로 변화되는 핵심 요소만을 자동으로 대조하여 보여주고, 비교의 범위를 시스템이 축소해야 합니다. 고객은 '무엇이 어떻게 달라지는지'만 확인하고 즉시 결정할 수 있는 구조로 전환되어야 합니다.

### RULE 1

비교 결과는 직관적인 대조 형태로 제공해야 합니다.

**DO**
- 현재 대비 변화값을 중심으로 결과를 즉시 이해 가능하게 합니다.
- 요금제와 같이 복잡한 조건을 포함한 비교 상황의 경우, 변경되는 핵심 정보만 요약된 구조를 함께 제공해야 합니다.

**DON'T**
- 개별 항목만을 나열해 고객이 직접 해석하도록 유도하지 않습니다.

### RULE 2

변화되는 핵심 정보만 선별해 확인이 가능해야 합니다.

**DO**
- 의사결정에 필요한 핵심 정보만 선별해 제공합니다.

**DON'T**
- 불필요한 세부 정보와 조건들로 고객의 판단을 방해하지 않습니다.

### RULE 3

고객 성향에 따라 비교 방식을 달리 구성해야 합니다.

**DO**
- 고객 성향에 따라 비교 방식을 달리 구성해야 합니다.

**DON'T**
- 모든 고객에게 동일한 비교 구조를 일괄 적용하지 않습니다.

### Scenario — 상황별 적용 방식

| 고객 유형 | 비교 방식 | 리드 카피 |
|---|---|---|
| 가치 체감형 | 혜택 업그레이드 중심 | "지훈님이 실제로 더 잘 쓰게 될 혜택부터 보여드릴게요." |
| 분석형 | 데이터 기반 절감 근거 중심 | "왜 요금제 변경이 필요한지 알려드릴게요." |
| 관계 중심형 | 그룹 혜택 변화 중심 | "달라지는 그룹혜택만 정리해봤어요." |
| 시니어 | 간소화된 변화 요약 | "데이터가 {N}GB 늘어 영상통화나 인터넷도 더 여유롭게 이용하실 수 있어요." |

[IMAGE_REQUIRED: DCD_2_scenario_value_type_comparison_mockup]
[IMAGE_REQUIRED: DCD_2_scenario_analysis_type_comparison_mockup]
[IMAGE_REQUIRED: DCD_2_scenario_relationship_type_comparison_mockup]
[IMAGE_REQUIRED: DCD_2_scenario_senior_comparison_mockup]
