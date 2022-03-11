import Tuits from "../components/tuits";
import { screen, render } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { findAllTuits } from "../services/tuits-service";

test('tuit list renders async', async () => {
    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits} />
        </HashRouter>);
    const linkElement = screen.getByText(/Mars rover landed/i);
    expect(linkElement).toBeInTheDocument();
})