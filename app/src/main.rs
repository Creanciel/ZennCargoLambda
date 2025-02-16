use lambda_http::{run, service_fn, Body, Request, Response};
use serde::{Deserialize, Serialize};

const ENDPOINT: &str = "https://jsonplaceholder.typicode.com/posts/1";
// {
//   "userId": 1,
//   "id": 1,
//   "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//   "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// }

#[tokio::main]
async fn main() -> Result<(), lambda_http::Error> {
    run(service_fn(handler)).await
}

async fn handler(_event: Request) -> Result<Response<Body>, lambda_http::Error> {
    // Response format
    #[derive(Deserialize, Serialize)]
    struct JsonPlaceholderPost {
        id: u64,
        #[serde(rename = "userId")]
        user_id: u64,
        title: String,
        body: String,
    }

    // API Request
    let json: JsonPlaceholderPost = reqwest::get(ENDPOINT).await?.json().await?;

    // Response
    let json_string = serde_json::to_string(&json)?;

    // Lambda Response
    let response = Response::builder()
        .status(200)
        .header("Content-Type", "application/json")
        .body(Body::from(json_string))?;

    Ok(response)
}
