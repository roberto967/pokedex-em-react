import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import PokemonCard from "../components/PokemonCard/PokemonCard";
import { getPkm, getPokemonsGen } from "./Assets/FechPkm/FechPkm";
import backgroundImg from "./Assets/imgs/pokemon_background.png";
import bgBackgroudImg from "./Assets/imgs/body_bg.png";

function DexCompleta() {
  const [gen, setGen] = useState(1);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qtdVisiveis, setqtdVisiveis] = useState(10);

  useEffect(() => {
    async function fetchData() {
      if (!pokemons.length && gen > 0) {
        setLoading(true);
        const results = await getPokemonsGen(gen);
        setPokemons(results);
        setLoading(false);
      }
    }
    fetchData();
  }, [gen, pokemons]);

  useEffect(() => {
    async function fetchImg() {
      if (pokemons.length === 0) {
        return;
      }

      if (pokemons.every((pokemon) => pokemon.imgUrl)) {
        return;
      }

      const pokemonArr = await getPkm(pokemons);

      const updatedPokemons = pokemons.map((pokemon, index) => ({
        ...pokemon,
        imgUrl: pokemonArr[index].sprites.front_default,
      }));

      setPokemons(updatedPokemons);
    }

    fetchImg();
  }, [pokemons]);

  async function handleClick() {
    if (gen < 9 && !loading && pokemons.length) {
      setLoading(true);
      const nextGen = gen + 1;
      const results = await getPokemonsGen(nextGen);
      setqtdVisiveis(10);
      setGen(nextGen);
      setPokemons(results);
      setLoading(false);
    }
  }

  function handleMostrarMais() {
    setqtdVisiveis(qtdVisiveis + 10);
  }

  function handleMostrarMenos() {
    if (qtdVisiveis > 10) {
      setqtdVisiveis(qtdVisiveis - 10);
    }
  }

  async function handleClick() {
    if (gen < 9 && !loading && pokemons.length) {
      setLoading(true);
      const nextGen = gen + 1;
      const results = await getPokemonsGen(nextGen);
      setqtdVisiveis(10);
      setGen(nextGen);
      setPokemons(results);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const pkmVisiveis = pokemons.slice(0, qtdVisiveis);

  return (
    <div
      style={{
        backgroundImage: `url(${bgBackgroudImg})`,
      }}
    >
      <Container>
        <Container
          fluid="xxl"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundColor: "white",
            backgroundSize: "100%",
          }}
        >
          <Row className="justify-content-center">
            {pkmVisiveis.map((pokemon, key) => {
              return pokemon.names.map((enName) => {
                if (enName.language.name === "en") {
                  return (
                    <Col
                      xs="12"
                      sm="6"
                      md="4"
                      lg="3"
                      style={{ padding: "4%" }}
                      key={key}
                    >
                      <PokemonCard nome={enName.name} img={pokemon.imgUrl} />
                    </Col>
                  );
                }
              });
            })}
          </Row>
          <div className="text-center mt-3">
            {pokemons.length > qtdVisiveis && (
              <Button variant="primary" onClick={handleMostrarMais}>
                Mostrar Mais
              </Button>
            )}

            {qtdVisiveis > 10 && (
              <Button variant="danger" onClick={handleMostrarMenos}>
                Mostrar Menos
              </Button>
            )}

            {!loading && gen < 9 && (
              <Button variant="success" onClick={handleClick}>
                Próxima Geração ({gen + 1})
              </Button>
            )}
            {loading && <div className="text-info mt-2">Carregando...</div>}
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default DexCompleta;
