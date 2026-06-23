---
pattern_file: "UXL_SCH"
journey_code: "SCH"
journey_name: "검색"
journey_description: "고객의 검색 의도를 해석하고 가장 적합한 결과를 즉시 제시해, 추가 탐색 없이 태스크 완료까지 이어지도록 합니다."
patterns:
  - pattern_id: "UXL_SCH_1"
    pattern_name: "의도 중심 검색 해석"
    screen_type: "search_result"
    trigger_data:
      - field: "search.input_text"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "search_query"
        source: "manual_input"
        required: true
      - key: "search_type"
        operator: "enum"
        values: ["natural_language", "keyword"]
        required: true
      - key: "user_context"
        source: "user_profile"
        required: true
    outputs:
      - component: "SearchResultPage"
        slot: "search_primary"
        condition: "search.input_text IS NOT NULL"
        state: "intent_resolved"
    do:
      - "IF search_type == 'natural_language' THEN route to agent_conversation_flow for intent clarification"
      - "IF search_type == 'keyword' THEN route to integrated_search_result_page with personalized ranking"
      - "IF search_intent IS ambiguous THEN render followup_question OR recommend_search_terms"
    dont:
      - trigger: "natural language query received"
        rejection: "apply keyword string-matching algorithm"
        fallback: "route to agent_conversation_flow"
      - trigger: "ambiguous query received"
        rejection: "return zero-result page without alternatives"
        fallback: "render clarification question and recommended search terms"
    copy_template: {}
    fallback_behavior:
      condition: "search_type unresolvable"
      render: "render keyword_search_result as default"

  - pattern_id: "UXL_SCH_2"
    pattern_name: "맞춤화된 결과 제시"
    screen_type: "search_result"
    trigger_data:
      - field: "search.query"
        operator: "is_not_null"
        value: ""
    inputs:
      - key: "search_query"
        source: "manual_input"
        required: true
      - key: "user_history"
        source: "user_profile"
        required: true
      - key: "user_context"
        source: "user_profile"
        required: true
    outputs:
      - component: "PersonalizedSearchResult"
        slot: "search_results"
        condition: "search_query IS NOT NULL"
        state: "personalized"
    do:
      - "IF user_history IS NOT NULL THEN reorder result_list based on user.usage_history and user.context"
      - "IF result_count == 0 THEN render alternative_path_card instead of empty_state"
      - "IF result_count > 0 THEN surface most_relevant_item at result_position_1"
    dont:
      - trigger: "search results available"
        rejection: "display identical result order for all users"
        fallback: "apply user_context_based ranking"
      - trigger: "result_count == 0"
        rejection: "render empty state with no guidance"
        fallback: "render alternative_path_card with suggested next steps"
    copy_template: {}
    fallback_behavior:
      condition: "user_history unavailable"
      render: "render platform_ranked_result_list"

  - pattern_id: "UXL_SCH_3"
    pattern_name: "결과 내 즉시 행동 유도"
    screen_type: "search_result"
    trigger_data:
      - field: "search_result.item_count"
        operator: "gt"
        value: "0"
    inputs:
      - key: "search_result_items"
        source: "real_time_api"
        required: true
      - key: "user_context"
        source: "user_profile"
        required: true
    outputs:
      - component: "SearchResultItem"
        slot: "search_results"
        condition: "item.action_available == true"
        state: "action_embedded"
    do:
      - "IF result_item.action_available THEN embed inline_action_button within result_item (no page navigation required)"
      - "IF result_action == 'terminate_subscription' THEN show termination_method_selector inline"
      - "IF result_action == 'subscribe' THEN show subscription_cta inline with relevant contextual copy"
    dont:
      - trigger: "action required after result view"
        rejection: "redirect user to separate action screen"
        fallback: "embed action inline within result item"
    copy_template:
      subscription_context: "현재 {user.name}님은 {current_product}에 매달 {current_price}원 결제 중이에요. 동일한 금액에 {benefit_desc}까지 포함된 구독 상품이 있어요."
      termination_options: "해지 방식을 선택할게요. 즉시해지는 지금 바로 종료되고, 예약해지는 이용 기간이 끝나는 날 해지돼요."
    fallback_behavior:
      condition: "action_available == false"
      render: "render result_item without inline action"

  - pattern_id: "UXL_SCH_4"
    pattern_name: "결과 신뢰성 및 투명성 확보"
    screen_type: "search_result"
    trigger_data:
      - field: "search_result.personalization_applied"
        operator: "eq"
        value: "true"
    inputs:
      - key: "personalization_reason"
        source: "real_time_api"
        required: true
    outputs:
      - component: "PersonalizationRationale"
        slot: "search_result_meta"
        condition: "personalization_applied == true"
        state: "visible"
    do:
      - "IF personalization_applied THEN render brief rationale label connecting result to user_context"
      - "IF AI_recommendation THEN render reasoning_snippet showing context basis (e.g. usage history, contract status)"
    dont:
      - trigger: "personalized result shown"
        rejection: "display result without any rationale"
        fallback: "render concise rationale label"
      - trigger: "rationale required"
        rejection: "hide reasoning or show opaque 'recommended for you' label only"
        fallback: "show specific context connection (e.g. '장기 고객 {N}년 기준')"
    copy_template:
      rationale_label: "${user.contract_years}년 장기 고객 기준 최대 ${max_discount}원 특별 혜택이 있어요"
    fallback_behavior:
      condition: "personalization_reason unavailable"
      render: "render result without rationale label"
---

# UXL_SCH — 검색 (Search)

> **검수 목적**: 고객의 검색 의도를 해석해 개인화된 결과와 즉시 실행 가능한 액션을 제공하는 화면을 AI가 일관되게 재현하기 위한 Single Source of Truth.

---

## UXL_SCH_1 — 의도 중심 검색 해석

### 개요

키워드 검색 시 단순 문자열 매칭이 아닌 고객의 이용 맥락을 반영하고, 자연어 입력 시 의도가 복수로 해석될 수 있는 쿼리에는 후속 질문이나 추천 검색어를 자연스럽게 제안하여 검색 정확도를 높여야 합니다.

### BEHAVIOR

고객은 키워드를 입력하고 여러 검색 결과를 탐색하며 원하는 정보를 직접 찾아야 합니다. 의도가 명확하지 않은 경우 여러 번 검색을 반복합니다.

### AS-IS (문제 상황)

검색이 순수 문자열 매칭으로만 동작하여 고객의 상황이나 맥락이 반영되지 않습니다. 자연어 입력이나 모호한 검색 의도는 정확히 해석되지 못합니다.

### TO-BE (목표 상태)

고객의 이용 맥락과 입력 의도를 함께 해석해 검색 유형에 맞는 탐색 방식으로 연결해야 합니다. 의도가 명확하지 않은 경우에는 후속 질문이나 추천 검색어를 통해 의도를 구체화해야 합니다.

### RULE 1

검색 입력은 단순 키워드가 아니라 고객 의도를 기반으로 해석하고, 검색 유형에 따라 적절한 탐색 방식으로 연결해야 합니다.

**DO**
- 검색 유형을 구분해 고객 맥락에 맞는 탐색 방향을 제안해야 합니다.
- 자연어 형태로 검색한 경우, 고객 의도를 해석하는 에이전트 흐름으로 연결해 질문 기반 탐색과 실행을 지원해야 합니다.
- 키워드 형태로 검색한 경우, 통합검색 결과 화면으로 연결하되 고객 맥락을 반영한 결과와 추천 질문을 명확히 제시하여 이탈을 방지해야 합니다.

**DON'T**
- 검색 유형 구분 없이 동일한 방식으로 처리하지 않습니다.

### Scenario — 상황별 적용 방식

| 입력 유형 | 예시 쿼리 | 연결 경로 |
|---|---|---|
| 자연어 검색 | "기기 바꾸고 싶은데 최대 할인 받으려면?" | 에이전트 대화 흐름 → 질문 기반 탐색 |
| 키워드 검색 | "아이폰 21" | 통합검색 결과 + 개인화 순위 + 추천 검색어 |

[IMAGE_REQUIRED: SCH_1_scenario_natural_language_mockup]
[IMAGE_REQUIRED: SCH_1_scenario_keyword_mockup]

---

## UXL_SCH_2 — 맞춤화된 결과 제시

### 개요

동일 키워드라도 고객마다 최적화된 결과와 순서를 제공하며, 검색 결과가 없거나 부족할 때도 대안 경로를 함께 제공해야 합니다.

### BEHAVIOR

고객은 동일한 검색어에 대해 모든 결과를 확인하며 자신에게 맞는 정보를 선별합니다. 결과가 없거나 부족한 경우 다시 검색하거나 이탈합니다.

### AS-IS (문제 상황)

검색 결과가 모든 고객에게 동일하게 제공되어 개인 상황에 맞지 않는 정보가 포함됩니다. 결과가 없을 경우 대안이 없어 탐색이 단절됩니다.

### TO-BE (목표 상태)

고객의 이용 이력과 맥락에 따라 결과와 순서를 개인화해야 합니다. 결과가 없거나 부족한 경우에도 대안 경로를 함께 제공해야 합니다.

### RULE 1

검색 결과는 고객의 상황과 맥락에 맞춰 개인화된 구조로 제공해야 합니다.

**DO**
- 고객의 이용 이력과 상태를 반영해 결과의 우선순위와 구성을 다르게 제공해야 합니다.

**DON'T**
- 모든 고객에게 동일한 결과와 순서를 일괄적으로 노출하지 않습니다.

### Scenario — 상황별 적용 방식

| 조건 | 결과 처리 |
|---|---|
| 결과 있음 + 개인화 적용 가능 | user_context 기반 우선순위로 결과 재정렬 |
| 결과 없음 | "이어서 검색해보세요" + 추천 검색어 카드 |

[IMAGE_REQUIRED: SCH_2_scenario_personalized_result_mockup]
[IMAGE_REQUIRED: SCH_2_scenario_zero_result_alternative_mockup]

---

## UXL_SCH_3 — 결과 내 즉시 행동 유도

### 개요

검색 결과를 단순 나열에 그치지 않고 각 항목에서 바로 실행 가능한 액션을 함께 제공하여, 검색에서 태스크 완료까지의 단계를 최소화해야 합니다.

### BEHAVIOR

고객은 검색 결과를 확인한 뒤 상세 페이지로 이동해 추가 탐색을 수행한 후 행동합니다. 여러 단계를 거치며 이탈이 발생합니다.

### AS-IS (문제 상황)

검색 결과가 단순 정보 나열에 그쳐 행동까지 이어지지 않습니다. 고객은 결과 확인 이후 별도의 경로를 통해 다시 이동해야 합니다.

### TO-BE (목표 상태)

탐색과 실행 단계를 통합해 검색 결과에서 바로 실행 가능한 액션을 제공해야 합니다. 고객은 추가 탐색 없이 결과에서 바로 행동으로 이어질 수 있어야 합니다.

### RULE 1

검색 결과 내에서 탐색과 실행이 분리되지 않도록 즉시 행동 가능한 구조를 제공해야 합니다.

**DO**
- 각 결과 항목에서 바로 실행 가능한 행동을 함께 제공해 추가 탐색 없이 완료까지 이어지도록 해야 합니다.
- 결과를 확인한 직후 행동이 필요한 경우, 추가 탐색 없이 해당 결과 영역 내에서 즉시 실행할 수 있도록 구성해야 합니다.

**DON'T**
- 결과 확인 이후 별도의 화면 이동이나 추가 탐색을 요구하지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 인라인 액션 |
|---|---|
| 구독 해지 검색 결과 | 해지 방식 선택(즉시/예약) 인라인 제공 |
| 구독 상품 검색 결과 | 가입 CTA + 동일 금액 대비 혜택 비교 인라인 제공 |

[IMAGE_REQUIRED: SCH_3_scenario_inline_termination_mockup]
[IMAGE_REQUIRED: SCH_3_scenario_inline_subscription_mockup]

---

## UXL_SCH_4 — 결과 신뢰성 및 투명성 확보

### 개요

AI 기반 개인화 검색 결과에 대해 고객이 왜 이 결과가 제시되었는지 이해할 수 있도록 근거를 간결하게 노출하고, 결과에 대한 신뢰를 형성해야 합니다.

### BEHAVIOR

고객은 검색 결과가 왜 노출되었는지 이해하지 못한 채 결과를 수용하거나 의심합니다. 특히 개인화 결과에 대한 신뢰가 낮습니다.

### AS-IS (문제 상황)

개인화 근거가 부족해 고객이 결과를 신뢰하기 어렵습니다. 이는 의사결정의 지연으로 이어집니다.

### TO-BE (목표 상태)

결과가 도출된 이유를 간결하게 제공해 고객이 납득 가능한 구조를 만들어야 합니다. 결과에 대한 신뢰를 기반으로 행동이 이어지도록 설계해야 합니다.

### RULE 1

검색 결과는 고객이 납득할 수 있는 근거와 함께 제공되어야 합니다.

**DO**
- 결과가 제시된 이유를 고객의 맥락과 연결해 간결하게 설명해야 합니다.

**DON'T**
- 근거 없이 결과만 제시하거나 판단 이유를 숨기지 않습니다.

### Scenario — 상황별 적용 방식

| 시나리오 | 근거 표시 방식 |
|---|---|
| 장기 고객 혜택 | "SKT 추가 혜택 (장기 고객 {N}년)" 레이블 표시 |
| AI 맞춤 추천 | 사용 이력 기반 추천 이유 스니펫 표시 |

[IMAGE_REQUIRED: SCH_4_scenario_rationale_longterm_mockup]
[IMAGE_REQUIRED: SCH_4_scenario_rationale_ai_recommendation_mockup]
