# HydroVision API Documentation

## Endpoints

### POST /upload

- **Descrição**: Recebe uma imagem em base64 e retorna a medida lida pela API.
- **Request Body**:
  ```json
  {
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "datetime",
    "measure_type": "WATER" ou "GAS"
  }
         

### Responses:
- 200: Operação realizada com sucesso
- 
```json
{
  "image_url": "string",
  "measure_value": integer,
  "measure_uuid": "string"
}
``
- 400: Dados inválidos

 ```json
{
  "error_code": "INVALID_DATA",
  "error_description": "<descrição do erro>"
}
```
- 409: Já existe uma leitura para este tipo no mês atual
 ```json
{
  "error_code": "DOUBLE_REPORT",
  "error_description": "Leitura do mês já realizada"
}
````


## PATCH /confirm

- **Descrição**: Confirma ou corrige o valor lido pelo LLM.
- **Request Body**:
json
{
  "measure_uuid": "string",
  "confirmed_value": integer
}

Responses:

- 200: Operação realizada com sucesso
 ```json
{
  "success": true
}
```
- 400: Dados inválidos

```json
{
  "error_code": "INVALID_DATA",
  "error_description": "<descrição do erro>"
}
```
- 404: Leitura não encontrada
- 
```json
{
  "error_code": "MEASURE_NOT_FOUND",
  "error_description": "Leitura não encontrada"
}
````
- 409: Leitura já confirmada
- 
```json
{
  "error_code": "CONFIRMATION_DUPLICATE",
  "error_description": "Leitura já confirmada"
}
```
## GET /<customer_code>/list
- **Descrição**: Lista as medidas realizadas por um determinado cliente.
- **Query Parameters**:
- 
measure_type: (opcional) "WATER" ou "GAS"

## Responses:

- 200: Operação realizada com sucesso
```json
{
  "customer_code": "string",
  "measures": [
    {
      "measure_uuid": "string",
      "measure_datetime": "datetime",
      "measure_type": "string",
      "has_confirmed": boolean,
      "image_url": "string"
    }
  ]
}
```
- 400: Tipo de medição não permitida
```json
{
  "error_code": "INVALID_TYPE",
  "error_description": "Tipo de medição não permitida"
}
````
- 404: Nenhuma leitura encontrada
```json
{
  "error_code": "MEASURES_NOT_FOUND",
  "error_description": "Nenhuma leitura encontrada"
}
```
