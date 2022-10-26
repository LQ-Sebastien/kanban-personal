# API Endpoints Specifications

## Listes

### `GET /lists`

Retourne un tableau des **Listes**, trié par `position` croissante.

#### Success (200)

```json
[{
  "id": 1,
  "name": "XXXXXX",
  "position": 1,
  "created_at": "XXXX",
  "updated_at": "XXXX"
}, {
  "id": 1,
  "name": "XXXXXX",
  "position": 2,
  "created_at": "XXXX",
  "updated_at": "XXXX"
}]
```

#### Errors

| Code | Body | Reason |
| -- | -- | -- |
| `500` | `{ "error": "Unexpected server error. Please try again later." }` | Une erreur a lieu avec la base de données | 

----------------

### `GET /lists/:id`

Retourne une **Liste**

#### Success (200)

```json
{
  "id": 1,
  "name": "XXXXXX",
  "position": 1,
  "created_at": "XXXX",
  "updated_at": "XXXX"
}
```

#### Errors

| Code | Body | Reason |
| -- | -- | -- |
| `500` | `{ "error": "Unexpected server error. Please try again later." }` | Une erreur a lieu avec la base de données |
| `404` | `{ "error": "List not found. Please verify the provided id." }` | L'id passé en paramètre n'est pas présent dans la base |


----------------


### `POST /lists`

- Créer et retourne une nouvelle **Liste**.
- Notes : 
  - le paramètre `name` est obligatoire (`string`)
  - le paramètre `position` est optionnel (`number`). Par défaut, la position de la nouvelle carte sera 0.

#### Body

- `Content-Type: application/x-www-form-urlencoded` : 

```json
{
  "name": "Nom de la liste",
  "position": 4
}
```

#### Success (201)

```json
{
  "id": 1,
  "name": "Nom de la liste",
  "position": 4,
  "created_at": "XXXX",
  "updated_at": "XXXX"
}
```

#### Errors

| Code | Body | Reason |
| -- | -- | -- |
| `500` | `{ "error": "Unexpected server error. Please try again later." }` | Une erreur a lieu avec la base de données |
| `400` | `{ "error": "Missing body parameter: name" }` | Le paramètre `name` est absent de la requête | 
| `400` | `{ "error": "Invalid type: position should be a number" }` | Le paramètre `position` fourni n'est pas un nombre entier | 

----------------


### `PATCH /lists/:id`

- Modifie partiellement la liste dont l'ID est précisé dans le chemin, et renvoie la ressource.
- Notes :
  - paramètres possibles pour le corps de la requête : `name` (`string`) ET/OU `position` (`number`).
  - la date de modification `updated_at` doit être modifiée.

#### Body

- `Content-Type: application/x-www-form-urlencoded` : 

```json
{
  "name": "Nouveau nom de la liste"
}
```

#### Success (200)

```json
{
  "id": 1,
  "name": "Nouveau nom de la liste",
  "position": 4,
  "created_at": "XXXX",
  "updated_at": "XXXX"
}
```

NB : dans la norme HTTP, une requête [PATCH](https://developer.mozilla.org/fr/docs/Web/HTTP/Methods/PATCH) n'a normalement pas de response body. Le statut de la réponse est normalement `204 (No content)`. Ici on 'simplifie' pour éviter une requête complémentaire la semaine prochaine. Ce n'est pas la première,ni la dernière fois que vous verrez des libertés prises vis-à-vis de la norme REST.

#### Errors

| Code | Body | Reason |
| -- | -- | -- |
| `500` | `{ "error": "Unexpected server error. Please try again later." }` | Une erreur a lieu avec la base de données |
| `404` | `{ "error": "List not found. Please verify the provided id." }` | L'id passé en paramètre n'est pas présent dans la base | 
| `400` | `{ "error": "Invalid body parameter 'name'. Should provide a string." }` | Le paramètre `name` passé dans le corps de la requête n'est pas une chaine de caractères valide | 
| `400` | `{ "error": "Invalid body parameter 'position'. Should provide a number." }` | Le paramètre `position` passé dans le corps de la requête n'est pas un nombre entier | 
| `400` | `{ "error": "Invalid body. Should provide at least a 'name' or 'position' property" }` | Le corps de la requête n'est pas précisé ou est vide |


----------------


### `DELETE /lists/:id`

- Supprime la **Liste** et toutes les cartes associées à cette liste.
- Notes :
  - la réponse n'a pas de corps.


#### Success (204)

Pas de corps.

#### Errors

| Code | Body | Reason |
| -- | -- | -- |
| `500` | `{ "error": "Unexpected server error. Please try again later." }` | Une erreur a lieu avec la base de données |
| `404` | `{ "error": "List not found. Please verify the provided id." }` | L'id passé en paramètre n'est pas présent dans la base | 

----------------
