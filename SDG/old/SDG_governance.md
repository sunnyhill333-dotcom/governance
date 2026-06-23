# SDG (SDUI Design Governance)

> SDUI 거버넌스의 전체 규칙을 정의합니다. Component, Naming, Organism, Page 네 영역의 규칙과 Local_ 정책 논의를 포함합니다.

---

## 목차

1. [SDG_CMP — Base Component](#sdg_cmp--base-component)
2. [SDG_NAM — 네이밍 규칙](#sdg_nam--네이밍-규칙)
3. [SDG_OGN — Organism](#sdg_ogn--organism)
4. [SDG_PAG — Page](#sdg_pag--page)
5. [Local_ 정책 논의](#local_-정책-논의)

---

## SDG_CMP — Base Component

Component는 SDUI에서 가장 작은 수 있는 단위 UI 단위입니다. 더 쪼개면 UI 역할을 수행할 수 없는 최소 단위를 Component로 정의합니다. Component는 단독으로 사용 가능하며 최소 단위로서 Organism이나 Page에 조합됩니다.

### 1. 단위 기준

Component는 단위로 단독 부여될 수 있는 기준에 따릅니다.

#### SDG_CMP_RULE_1 — Component는 단일 책임만 가져야 합니다.

하나의 컴포넌트는 하나의 역할, 하나의 UI 조각만을 담당합니다. 두 가지 이상의 역할을 결합하면 재사용성이 떨어집니다. 두 가지 역할을 처리하는 Component는 두 개의 Component로 분리하거나, 각각의 Component를 Organism으로 통합합니다.

#### SDG_CMP_RULE_2 — Component는 단 하나의 관심 단위만을 합니다.

하나의 단위만을 표현해야 하며, 다양한 형태로 사용하더라도 Component는 고정된 역할을 갖습니다. 두 가지 역할을 갖는 Component의 경우 Organism으로 분리하거나, 각각의 Component를 별도로 분리합니다. 두 가지 역할을 갖는 Component는 Organism으로 통합합니다.

#### Foundation 파트

Foundation 역할, 네이밍, 파악 관련 모든 Component를 사이트에 등록합니다. Foundation 역할인 Component 역할인 Foundation을 사용할 수 있는지 확인해야 합니다. Badge 또는 Component만 Foundation 이름으로 사용합니다.

```
Component: {is} name="use_action_type_AAA (list:{name} | Component)"
```

| Do | Don't |
|---|---|
| 단독으로 사용 가능한 UI 단위 Component | 여러 역할을 수행하는 단일 Component |
| InputWithLabel | ActionWithVideoText |
| ActionWithVideo | CheckboxWithDescription |
| CheckboxWithDescription | |

> **주의**: 하나의 Component가 두 가지 이상의 역할을 가질 경우, 해당 Component를 두 개의 별도 Component나 Organism의 Action Button으로 분리해야 합니다.

---

### 2. 재사용성

Component는 특정 화면이나 맥락에 종속되지 않아야 합니다.

#### SDG_CMP_RULE_1 — Component의 단위이지 만들어 과도하지 않아야 합니다.

특정 화면을 위한 일회성 Component가 되면 재사용 가능성이 낮아집니다.

#### SDG_CMP_RULE_2 — 재사용을 확인하는 방법으로 Component를 검토합니다.

Component의 의미, 맥락과 종류 이름의 일치 여부를 확인합니다.

| Do | Don't |
|---|---|
| 범용적인 이름의 Component | 특정 화면에 종속된 Component |
| ButtonLargePrivacy | HeaderReduction |
| ButtonSmallOptOut | FooterReduction |
| BadgeMatch | |

---

### 3. 역할 독립성

Component는 다른 Component의 역할에 영향을 주거나 받지 않아야 합니다.

#### SDG_CMP_RULE_1 — Component는 역할은 다른 Component에서 단일 역할을 합니다.

위치 변경을 반영하도록 UI에서 이미지나 데이터를 변경하는 역할은 Organism이 부여합니다.

#### SDG_CMP_RULE_2 — Component는 다른 Component의 역할 수행을 위해 사용되지 않습니다.

다음의 경우 재사용 가능하지 않습니다.

#### SDG_CMP_RULE_3 — 아래의 경우 재사용 가능하지 않습니다.

| Do | Don't |
|---|---|
| 단일 역할만 담당 | 복합 역할 Component |
| Badge | Cartridge |
| Progressbar | SearchProgressbar |

---

## SDG_NAM — 네이밍 규칙

UI 구성의 모든 요소에 이름을 부여하는 규칙입니다. 이름 부여 기준으로 Component가 신뢰성 높고 더 명확하게 일반화됩니다. 이름 부여 방법으로 재사용 가능성을 높이고, 이름 뿐만 아니라 Local_에서의 변경 가능성도 확보됩니다.

### 1. 표기 규칙

#### SDG_NAM_RULE_1 — 이름 뒤의 규칙을 일관되게 유지합니다.

#### SDG_NAM_RULE_2 — 항상 PascalCase를 사용합니다.

상위, 하위에 상관없이 Button, Text, BenefitList 모두 PascalCase로 사용해야 합니다.

#### SDG_NAM_RULE_3 — 변형 Variant를 사용할 수 있습니다.

단위의 기준을 정하여 Variant를 설정할 수 있습니다.

| Do | Don't |
|---|---|
| PascalCase 유지 | camelCase 혼용 |
| PrimaryButton | primaryButton |
| CardContent | card_content |

---

### 2. 단어별 레인 (Word Lane)

Component, Page 이름에 포함된 단어들은 역할별 레인을 따릅니다.

#### SDG_NAM_RULE_1 — Component 이름 형식

```
{Name}{z}{Name}{Variant}
```

- Organism 및 Component를 조합할 때 이 형식을 따릅니다.

#### SDG_NAM_RULE_2 — Organism 이름 형식

```
{Name}{Variant}
```

Organism Component는 조직화된 형태로 분류합니다.

#### SDG_NAM_RULE_3 — Page 이름 형식

```
{ItemName}Page
```

Page 이름은 반드시 `Page` 접미사로 끝나야 합니다.

| Do | Don't |
|---|---|
| Badge | Badge |
| ProfCardDetailPage | ProfCardDetailProCard |
| ProductDetailPage | ProfDetailProCard |

---

### 3. 결합 이름 원칙

#### SDG_NAM_RULE_1 — Component 이름은 독립적으로 사용하며 함부로 결합하지 않습니다.

#### SDG_NAM_RULE_2 — 결합 이름은 접두사(prep)를 사용합니다.

| Do | Don't |
|---|---|
| ProfCard | SalConfProfList/Card |
| ProfCardList | SalConfProfList |
| ListContentList | UserConnectionBox (의미 불명) |
| ContentBox | |

---

## SDG_OGN — Organism

Organism은 Component의 한 단계 상위 레벨로, 서비스에 구현되는 UI의 주요 단위입니다. 적합한 아이덴티티를 고정하며, 재사용성은 이 수준에서 결정됩니다.

### 1. 단위 기준

#### SDG_OGN_RULE_1 — 다중 요소로 구성된 Component 단위가 Organism이 됩니다.

#### SDG_OGN_RULE_2 — Organism은 최상위 Component 레벨을 담당합니다.

- Foundation → Organism → Page 순서의 레벨 구조를 따릅니다.

#### SDG_OGN_RULE_3 — Organism은 단독으로 사용되어야 합니다.

Organism이 갖는 기준 내에서 Component가 하위로 구성됩니다.

> **Key**: `local_` 관련 처리는 SDG_OGN_RULE_4에 따릅니다. SDG_OGN local_는 SDG_PAG, SDG_CMP와 연동되며, SDG_OGN Rule에 의해서 SDG local_ 이하 도구 내에서 확인합니다.

#### SDG_OGN_RULE_4 (주의) — 단일 요소만으로 구성된 경우 Organism으로 분류하지 않습니다.

| Do | Don't |
|---|---|
| 다중 요소 구성 → Organism 분류 가능 | 단일 요소만 구성 → Organism 분류 불가 |
| AppList | AppList/AppLink |
| AppButton | |
| AppLocation | |

---

### 2. 순위 규칙 (Ordering)

#### SDG_OGN_RULE_1 — Organism이 갖는 정의에 따라 Component가 정의됩니다.

- Foundation, Organism Component로 표현됩니다.
- 예: BrackComponent/RegisterPage, UXL EntryList, UXL ProfCard / UXL ProfCardUXLCard / RegisterPage

#### SDG_OGN_RULE_2 — 다중 데이터 Page에서 사용 가능한 최상위 Organism입니다.

Local_Component가 아닌 경우, Local_를 사용한 UXL Page와 올바른 Organism를 조합합니다. Page는 Foundation Component+Organism 중에 예외가 적용됩니다.

**올바른 Organism + Component 조합 구조 (예: ProfCardPage)**

| Do | Don't |
|---|---|
| Organism + Component 정상 조합 | Page 내 컨텐츠 누락 |
| ProfCard (내부: Foundation) | 레이아웃이 최소 2단 이상 |
| OI (title, price, ...) | |
| Divider (Separator) | |
| Calendar (selected+calendar) | |
| BreadCrumb (breadcrumb) | |
| ActionList (ActionList) | |

---

### 3. 등록 (Registration)

#### SDG_OGN_RULE_1 — Organism은 유형에 따라 등록이 필요합니다.

#### SDG_OGN_RULE_2 — Local_가 필요한 Organism은 별도 등록합니다.

| Do | Don't |
|---|---|
| Local_ 유형 포함 Organism | Local_ 없이 단독 Organism Component |
| Local_BadgeScore | BadgeScore |
| Local_AppIcon | AppIcon |

---

### 4. Local_ 사용 기준

#### SDG_OGN_RULE_1 — Local_는 Organism 기준에 따라 Component 단위로 정의됩니다.

#### SDG_OGN_RULE_2 — Local_는 등록된 Organism 중 실제로 결정된 것만 사용 가능합니다.

#### SDG_OGN_RULE_3 — Local_는 Organism이 아닌 Component 단위로 정의됩니다.

| Do | Don't |
|---|---|
| Organism 선택 후 올바른 인수 사용 | 잘못된 Organism 코드 유형 사용 |
| Organism: `code_type` | Organism: `wrong_code_type` |
| Local_Specimen(option): icon, logo, ... | Local_Specimen(option): icon, logo, ... |

---

## SDG_PAG — Page

Page는 Organism과 Component를 조합하여 사용자에게 서비스를 제공하는 단위입니다. 한 화면 단위마다 하나의 Page 파일을 만들며, 이 Page 파일이 화면을 표현하고 사용자가 기능을 동작합니다.

### 1. 단위 기준

#### SDG_PAG_RULE_1 — 화면 단위로 Page 파일은 하나씩 존재합니다.

#### SDG_PAG_RULE_2 — Page는 단 하나의 Organism만 사용하는 것도 가능합니다.

#### SDG_PAG_RULE_3 — 여러 Organism과 Component를 활용하여 구성합니다.

#### SDG_PAG_RULE_4 — 기준이 다른 Page는 Foundation Component 기준이 다릅니다.

복잡한 Page에서는 Foundation Component를 연계하여 사용할 수 있습니다. PageMeta를 사용하여 역할 권한 설정을 정리합니다.

| Do | Don't |
|---|---|
| 컨텐츠 있는 화면 → Organism 사용 | 컨텐츠 없는 화면 → Foundation Component만 포함 |
| SearchAboutPage | ActionAboutPage |
| ProfDetailPage | ProfDetailProCard |
| ProductDetailPage | ProductDetail |

---

### 2. 조직 규칙 (Organization)

#### SDG_PAG_RULE_1 — Page마다 최소한 하나의 Organism으로 구성되어야 합니다.

#### SDG_PAG_RULE_2 — 라우터 데이터에 따른 Page 구성이 필요합니다.

- 단, Component와 동일 사용을 Organism 안에서 허용합니다.
- Foundation, Organism의 Page 구성 원칙은 아래를 따릅니다.

```
Page = {
  (1) n개의 Foundation + Organism 연결  (최소 1개)
  (2) 추가 Component 포함               (최소 0개)
  (3) Autoclosed (Organism)             (최소 0개)
  (4) ActionList (ActionList)           (최소 0개)
}
```

**Local_ 단위는 Foundation Component 하나만 허용합니다.**

Local_ 단위 정의를 확인하여, Local_의 UXL Page 조건에서만 허용됩니다. 따라서 Organism이 정의된 범위 내에서 허용된 Local_만 사용해야 합니다.

| Do | Don't |
|---|---|
| 올바른 Organism + Component 조합 | Page 내 레이아웃 부족 |
| ProfCardPage | 레이아웃 최소 2단 이상 필요 |
| ({Org_Foundation_Component}) | |
| ({1+n 조 Foundation}) | |
| ({n 추가 Component}) | |
| ({n Autoclosed}) | |
| ({n ActionList}) | |

---

### 3. 정책 예외 케이스

#### SDG_PAG_RULE_1 — Local_ 단위 페이지에는 예외가 없습니다.

#### SDG_PAG_RULE_2 — Local_ 단위 내의 이중 기준이 존재합니다.

Local_ 단위 설정 기준에 따른 아이디어를 사용할 때, Page에서는 이어지는 상황에서 Local_를 따라 Local_에 적용된 것을 기준으로 합니다. 따라서 Local_에서는 Local_에서 확인한 상태에서 준비합니다.

#### SDG_PAG_RULE_3 — Local_ 안에 올바른 Organism이 있어야 합니다.

#### SDG_PAG_RULE_4 — Page의 아이디어 Organism 안에 Local_를 작성할 경우, 아이디어를 추가합니다.

---

## Local_ 정책 논의

Local_의 적합한 정의와 구현 방법에 대한 논의입니다. 재정의가 필요하며, 데이터팀/구현팀 간 명확한 기준이 필요합니다.

### 현재 정책 현황

**Local_은 현재 어떻게 정의되어 있는가?**

- SDG Component를 기본으로 하되, Organism 범위에서 Local_Component를 불러올 수 있습니다.
- Local_는 SDG에서 제공하지 않는 기능/형태를 정의하는 것입니다.
- Local_는 SDG에서 정의한 각 로직 컴포넌트를 참조하여 custom할 수 있습니다.

**Local_ 유형 목록**

| 유형 | 설명 |
|---|---|
| local | 가장 기본 단위 |
| Local_Style | 스타일 재정의 |
| Local_Props | Props 재정의 |
| Local_Function | 함수 재정의 |
| Local_Component | 컴포넌트 재정의 |
| Local_Page | 페이지 재정의 |

**Local_ 사용 현황의 문제점**

- 팀에 따라 다르게 사용되고 있어 사용 현황이 불일치
- 페이지를 컴포넌트로 합치는 케이스 발생 (로컬 페이지 → 컴포넌트)
- 불일치가 발생하는 케이스: Local_Z, Z: Object에 포함됨

**SDG에 대해 Local_가 작동하는 순서**

```
SDG_CMP_RULE
  → SDG_OGN_RULE
    → SDG_PAG_RULE
      → Local_Style
        → Local_Props
          → Local_Function
            → Local_Component
              → Local_Page
```

---

### 로컬 사용의 문제

**지금 어떤 문제가 있는가?**

- Local_Z는 어떠한 Organism 이내에서만 표현되어야 합니다.
- Local_Z가 Organism과 혼동되는 케이스가 있습니다. (Organism에 위치한 Local_Z의 사용 중 정의가 혼용)
- Local_는 Organism이면서 단독 local_ 이내 정의가 되어야 합니다.
- **근본 원인**: Local_Z와 Organism의 구분 방법이 없습니다.

**문제 요약**

SDG에서 Local_와 Organism을 함께 연결하여 구현하기 위한 기준이 복잡합니다. Component 정의를 명확히 정리하면 이어지는 기준 정의가 간소화되어 구현이 수월해집니다.

---

### Local_Z_Organism 선택 아이디어

세 가지 개선안을 논의합니다.

#### 개선안_1: Local_None

SDG Component에 상응하는 연결이 없는 경우 `None`으로 표기합니다.

- Local_를 SDG와 연결하는 코드 스타일을 유지합니다.
- 현재 Local_에서 SDG Component와 연결하지 않고 자체 구현할 경우 사용합니다.

```ts
(Local_None).child = SomeSdgComponent(...)
[type: "Local_None"] = component
```

#### 개선안_2: Local_Link

SDG Component와 모두 연결이 되는 경우 `Link`로 표기합니다.

- SDG와 연결하는 것을 원칙으로 합니다.
- Local_에서 SDG에 상응하는 컴포넌트를 사용하는 경우에 사용합니다.

```ts
Local_Link([SomeSdgComponent(...), SomeSdgComponent(...)])
[type: "Local_Link"] = SomeSdgComponent(...)
```

#### 개선안_3: Local_Extends

SDG Component 중 일부 확장이 필요한 경우 `Extends`로 표기합니다.

- Local_의 확장 필요성이 있는 경우 사용합니다.

```ts
Local_Extends: Local_기능을 확장하여 사용합니다.
[type: "Local_Extends"] = SomeSdgComponent(...)
```

---

### Local_Z_사전 정의 방법

SDG와 Local_의 관계를 명확하게 사전 정의하여야 합니다.

| Do | Don't |
|---|---|
| SDG 기반 Local_ 사용 | 임의 Local_ 사용 |
| Organism: `code_type` | Organism: `wrong_code_type` |
| Local_Specimen(option): icon, logo, ... | Local_Specimen(option): icon, logo, ... |

---

### Local_Z 관련 이슈 결론

**결론 정의**

| 유형 | 설명 | SDG 연결 여부 |
|---|---|---|
| Local_None | SDG와 연결되지 않는 경우 | 없음 |
| Local_Link | SDG와 완전히 연결되는 경우 | 완전 연결 |
| Local_Extends | SDG를 일부 확장하는 경우 | 부분 확장 |

**원칙**

1. Local_는 SDG Component를 기본으로 하며, Organism의 범위에서만 사용됩니다.
2. Local_의 사용 기준을 명확하게 정의하여 사용 범위를 제한합니다.
3. SDG의 기준을 따르되, 필요에 따라 Local_를 사용하는 것이 원칙입니다.
4. Local_None / Local_Link / Local_Extends 세 가지 유형으로 구분하여 사용합니다.

---

## 전체 규칙 계층 요약

```
Foundation (SDG_CMP)
  └─ 최소 단위 UI Component
  └─ 단일 책임, 단일 관심, 역할 독립성

Organism (SDG_OGN)
  └─ 다중 Component 조합 단위
  └─ Local_와 연결 가능 (Local_None / Local_Link / Local_Extends)

Page (SDG_PAG)
  └─ Organism + Component 조합으로 화면 구성
  └─ 화면 단위 = 1 Page
  └─ 최소 1 Organism 필수

Naming (SDG_NAM)
  └─ PascalCase 필수
  └─ {Name}{Variant} 형식 (Component)
  └─ {ItemName}Page 형식 (Page)
  └─ 결합 이름 사용 금지 (접두사 허용)

Local_ 정책
  └─ Local_None: SDG 연결 없음
  └─ Local_Link: SDG 완전 연결
  └─ Local_Extends: SDG 부분 확장
```
