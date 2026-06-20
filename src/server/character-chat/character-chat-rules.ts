import type {
  CharacterChatMovieDto,
  CharacterChatSupportedMovieRepoResult,
} from "./character-chat-types"

export const CHARACTER_CHAT_SUPPORTED_MOVIE_IDS = [155, 670]
export const CHARACTER_CHAT_RECENT_MESSAGE_LIMIT = 8
export const CHARACTER_CHAT_FALLBACK_QUESTIONS = [
  "그 순간 당신은 무엇을 가장 두려워했나요?",
  "그 선택을 다시 해도 똑같이 할 건가요?",
]

export function mapSupportedMovieDto(
  movie: CharacterChatSupportedMovieRepoResult,
  avatarUrlsByPath: Map<string, string>,
  posterUrl: string | null,
): CharacterChatMovieDto {
  return {
    id: movie.id,
    title: movie.title,
    genres: movie.genres,
    posterUrl: posterUrl ?? "",
    description: movie.overview ?? "",
    actors: unique(movie.characters.flatMap((character) => (character.actorName ? [character.actorName] : []))),
    characters: movie.characters.map((character) => ({
      id: character.id,
      name: character.name,
      description: character.description,
      greeting: character.greeting,
      avatarUrl: avatarUrlsByPath.get(character.avatarStoragePath) ?? "",
      actor:
        character.actorPersonId && character.actorName
          ? { id: character.actorPersonId, name: character.actorName }
          : null,
    })),
  }
}

export function normalizeSuggestedQuestions(questions: string[]) {
  const normalized = unique(questions.map((question) => question.trim()).filter(Boolean)).slice(0, 4)
  return normalized.length > 0 ? normalized : CHARACTER_CHAT_FALLBACK_QUESTIONS
}

function unique<T>(values: T[]) {
  return [...new Set(values)]
}
