import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult, type Context } from 'aws-lambda'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { type Movie, MovieSchema, PartialMovieSchema } from '../types/movie.interface'
import { StatusCodes } from 'http-status-codes'

// global, to be chared across close calls
const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)
const tableName = process.env.MOVIE_TABLE_URL

const badRequestError = (error: string): APIGatewayProxyResult => ({
  body: JSON.stringify({
    message: error
  }),
  statusCode: StatusCodes.BAD_REQUEST,
  headers: {
    'content-type': 'application/json'
  }
})

export async function handler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const schema = event.httpMethod === 'POST' ? MovieSchema : PartialMovieSchema

  if (event.body == null) {
    return badRequestError('Invalid Body')
  }

  const parseResult = schema.safeParse(
    JSON.parse(event.body)
  )

  if (!parseResult.success) {
    return badRequestError(JSON.stringify(parseResult.error))
  }

  const payload = parseResult.data as Movie

  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: payload
    })
  )

  return {
    body: JSON.stringify({
      message: `Movie ${(event.httpMethod === 'POST') ? 'Created' : 'Updated'}`
    }),
    statusCode: (event.httpMethod === 'POST') ? StatusCodes.CREATED : StatusCodes.ACCEPTED,
    headers: {
      'content-type': 'application/json'
    }
  }
}
