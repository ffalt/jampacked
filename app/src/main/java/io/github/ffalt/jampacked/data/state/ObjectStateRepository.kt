package io.github.ffalt.jampacked.data.state

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.FavResultQuery
import io.github.ffalt.jampacked.graphql.RateResultQuery
import io.github.ffalt.jampacked.graphql.SetFavResultMutation
import io.github.ffalt.jampacked.graphql.SetRateResultMutation
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ObjectStateRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun isFaved(id: String): Result<Boolean> =
            runCatching {
                val response = apollo.client().query(FavResultQuery(id)).execute()
                response.data?.state?.faved != null
            }

        suspend fun setFaved(
            id: String,
            faved: Boolean
        ): Result<Boolean> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .mutation(SetFavResultMutation(id = id, remove = !faved))
                        .execute()
                val result = response.data?.fav?.faved != null
                invalidateHome()
                result
            }

        suspend fun rating(id: String): Result<Int> =
            runCatching {
                val response = apollo.client().query(RateResultQuery(id)).execute()
                response.data?.state?.rated ?: 0
            }

        suspend fun setRating(
            id: String,
            rating: Int
        ): Result<Int> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .mutation(SetRateResultMutation(id = id, rating = rating))
                        .execute()
                val result = response.data?.rate?.rated ?: 0
                invalidateHome()
                result
            }

        private suspend fun invalidateHome() {
            cache.remove(QueryCache.cacheKey("HomeResult"))
        }
    }
