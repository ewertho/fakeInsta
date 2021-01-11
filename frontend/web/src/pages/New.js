import { useState } from "react";
import { useHistory } from "react-router-dom";
import "./New.css";
import api from "../services/Api";

function New() {
  const [imagem, setImagem] = useState(null);
  const [author, setAuthor] = useState("");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    data.append("image", imagem);
    data.append("author", author);
    data.append("place", place);
    data.append("description", description);
    data.append("hashtags", hashtags);

    await api.post("/posts", data);

    history.push("/");
  }

  return (
    <form id="new-post" onSubmit={handleSubmit}>
      <input
        type="file"
        name=""
        id=""
        onChange={(e) => setImagem(e.target.files[0])}
      />
      <input
        type="text"
        name="author"
        placeholder="Nome"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        name="place"
        placeholder="Local"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />
      <input
        type="text"
        name="description"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        name="hashtags"
        placeholder="hashtags"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default New;
