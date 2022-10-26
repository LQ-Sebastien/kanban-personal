## Brouillon de MLD avant l'implémentation pour un SGBD particulier (Postgres)

- `LIST` (id[INT], name[TEXT], position[INT])

- `CARD` (id[INT], content[TEXT], position[INT], color[TEXT], #list_id[INT -> LIST.id])

- `TAG` (id[INT], name[TEXT], color[TEXT])

- `CARD_HAS_TAG` (id[INT], #card_id[INT -> CARD.id], #tag_id[INT -> #tag.id])





### Notes

- LABEL = TAG
- La relation card_has_tag n'a pas vraiment besoin d'un ID, on pourrait faire une clé primaire en prenant les 2 attributs
