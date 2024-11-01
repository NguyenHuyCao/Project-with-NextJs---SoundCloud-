import { Container } from "@mui/material";
import ClientSearch from "./components/client.search";

const SearchPage = () => {
  return (
    <Container sx={{ mt: 3 }}>
      <ClientSearch />
    </Container>
  );
};

export default SearchPage;
