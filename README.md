# Team 2

## 📽️ Cinemate 씨네메이트

AI 기반 개인화 추천과 대화형 검색으로 취향에 꼭 맞는 영화를 찾아보세요

➡️
https://skkuse-cinemate.vercel.app/

## 프로젝트 세팅

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env.local`을 만들고 필요한 값을 채웁니다.

```bash
cp .env.example .env.local
```

주요 환경 변수는 다음과 같습니다.

| 변수                                         | 설명                                        |
| -------------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                   | Supabase 프로젝트 URL                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`              | Supabase anon key                           |
| `SUPABASE_SERVICE_ROLE_KEY`                  | 서버/seed 작업용 Supabase service role key  |
| `SUPABASE_DB_PASSWORD`                       | Supabase CLI용 원격 DB 비밀번호              |
| `SUPABASE_POOLER_DATABASE_URL`               | Supabase Postgres connection pooler URL     |
| `OPENAI_API_KEY`                             | AI 추천/채팅 기능에 사용하는 OpenAI API key |
| `OPENAI_RECOMMENDATION_CHAT_MODEL`           | 추천 채팅 LLM 모델                          |
| `OPENAI_RECOMMENDATION_CHAT_EMBEDDING_MODEL` | 추천 채팅 embedding 모델                    |
| `TMDB_READ_ACCESS_TOKEN`                     | TMDB 데이터 수집용 read access token        |
| `TMDB_API_KEY`                               | TMDB API key                                |

### 3. Supabase DB 스키마 준비

Seed 데이터를 적재하기 전에 `supabase/migrations`의 migration을 Supabase DB에 적용합니다.

```bash
supabase db push
```

### 4. MovieLens 데이터셋 준비

Seed script 실행을 위해 MovieLens Latest Dataset의 Full 버전이 필요합니다.

1. [MovieLens Latest Datasets](https://grouplens.org/datasets/movielens/)에서 `ml-latest.zip`을 다운로드합니다.
2. 프로젝트 루트에 압축을 해제해 `ml-latest` 디렉터리를 위치시킵니다.

최종 디렉터리 구조는 다음과 같아야 합니다.

```text
cinemate/
├── ml-latest/
│   ├── genome-scores.csv
│   ├── genome-tags.csv
│   ├── links.csv
│   ├── movies.csv
│   ├── ratings.csv
│   └── tags.csv
├── package.json
└── ...
```

### 5. 영화/추천 Seed 데이터 준비

Seed 데이터는 반드시 아래 순서대로 적재합니다.
영화/추천 seed가 먼저 준비되어야 추천 채팅과 캐릭터 채팅 데이터가 정상적으로 연결됩니다.

MovieLens 데이터셋과 TMDB API를 기반으로 DB 적재용 CSV를 생성합니다.

```bash
pnpm seed:movie-catalog:generate-csv-from-movielens
pnpm seed:movie-credits:generate-csv-from-tmdb
pnpm seed:movie-recommendation:generate-csv-from-movielens
```

생성된 CSV는 각 seed 디렉터리의 `generated` 폴더에 저장됩니다.

```text
seeds/movie-catalog/generated/
seeds/movie-credits/generated/
seeds/movie-recommendation/generated/
```

다음 명령으로 생성된 CSV를 Supabase DB에 적재합니다.

```bash
pnpm seed:movie-catalog:upload-csv-to-supabase
pnpm seed:movie-credits:upload-csv-to-supabase
pnpm seed:movie-recommendation:upload-csv-to-supabase
```

### 6. 추천 채팅 Seed 데이터 준비

추천 채팅은 사용자가 입력한 자연어에서 태그를 추출한 뒤, 해당 태그와 씨네메이트 태그의 의미적 유사도를 비교해 추천 후보를 찾습니다.

이를 위해 미리 씨네메이트 태그에 OpenAI embedding vector를 붙인 seed 데이터를 Supabase DB에 적재합니다.

```bash
pnpm seed:recommendation-chat:generate-tag-embedding-file
pnpm seed:recommendation-chat:generate-tag-embedding-vectors
pnpm seed:recommendation-chat:upload-tag-embeddings-to-supabase
```

### 7. 캐릭터 채팅 Seed 데이터 준비

캐릭터 채팅을 위해 캐릭터 프로필, 캐릭터 이미지, 영화별 사건, 사건별 등장 캐릭터, 캐릭터별 기본 질문 데이터를 미리 Supabase DB와 Storage에 저장합니다.

캐릭터 채팅 seed는 `seeds/character-chat/movies/{movieId}` 하위의 캐릭터 설정, 사건 설정, 기본 질문 설정, 프롬프트, 이미지 파일을 기반으로 생성합니다.

```bash
pnpm seed:character-chat:upload-images
pnpm seed:character-chat:generate-csv
pnpm seed:character-chat:upload
```

### 8. 개발 서버 실행

```bash
pnpm dev
```

기본 실행 주소는 `http://localhost:3000`입니다.

## 핵심 기능 설명 문서

1. [MovieLens 데이터셋](docs/reference/1.movielens-dataset.md)
2. [Seed 데이터 구성](docs/reference/2.seed-overview.md)
3. [맞춤 추천](docs/reference/3.personalized-recommendation.md)
4. [캐릭터 채팅](docs/reference/4.character-chat.md)
5. [AI 추천 채팅](docs/reference/5.ai-recommendation-chat.md)

## 👤 Developers

| 이름   | 역할     |
| ------ | -------- |
| 왕지훈 | BackEnd  |
| 이진성 | FrontEnd |
| 서동규 | BackEnd  |
| 정다연 | FrontEnd |

## 발표자료

- [제안서](docs/submission/소공개_2조_제안서.pdf)
- [요구사항 명세서](docs/submission/software-requirements-spec/cinemate-requirements-spec.pdf)
- [디자인 명세서](docs/submission/design-spec/cinemate-design-spec.pdf)
- [최종 발표 자료](docs/submission/cinemate-final-presentation.pdf)
