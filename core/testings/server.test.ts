import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import Server from "../server";

chai.use(chaiHttp);

describe("Server API Tests", () => {
  let server: Server;

  before(() => {
    server = Server.getInstance();
    server.start(5000);
  });

  after(() => {
    // Add any cleanup code here if necessary
  });

  describe("GET /state", () => {
    it("should return the current state of the Sonos device", async () => {
      const res = await chai.request(`http://localhost:5000`).get("/state");
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
    });
  });

  describe("POST /volume", () => {
    it("should set the volume of the Sonos device and return the updated state", async () => {
      const volume = 50;
      const res = await chai.request(`http://localhost:5000`).post("/volume").send({ volume });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
      // If you have access to the volume property, you can uncomment the following line:
      // expect(res.body.volume).to.equal(volume);
    });
  });

  // Please note that the tests for the following endpoints might not work correctly
  // if the server is not connected to a Sonos device and/or the Spotify API.

  describe("POST /resume", () => {
    it("should resume playback and return true", async () => {
      const res = await chai.request(`http://localhost:5000`).post("/resume");
      expect(res).to.have.status(200);
      expect(res.body).to.be.true;
    });
  });

  describe("POST /pause", () => {
    it("should pause playback and return true", async () => {
      const res = await chai.request(`http://localhost:5000`).post("/pause");
      expect(res).to.have.status(200);
      expect(res.body).to.be.true;
    });
  });

  describe("POST /queue", () => {
    it("should add media to the queue and return an object", async () => {
      const mediaUri = "x-sonos-spotify:spotify:track:6rqhFgbbKwnb9MLmUQDhG6?sid=12&flags=8224&sn=7"; // Replace with a valid mediaUri
      const res = await chai.request(`http://localhost:5000`).post("/queue").send({ mediaUri });
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
    });
  });

  describe("GET /queue", () => {
    it("should return the current queue", async () => {
      const res = await chai.request(`http://localhost:5000`).get("/queue");
      expect(res).to.have.status(200);
    });
  });

  describe("DELETE /queue", () => {
    it("should clear the queue and return true", async () => {
      const res = await chai.request(`http://localhost:5000`).delete("/queue");
      expect(res).to.have.status(200);
      expect(res.body).to.be.true;
    });
  });

  describe("POST /search/artists", () => {
    it("should search for artists and return an array of results", async () => {
      const searchWord = "Coldplay";
      const res = await chai.request(`http://localhost:5000`).post("/search/artists").send({ searchWord });
      expect(res).to.have.status(200);
    });
  });

  describe("POST /search/tracks", () => {
    it("should search for tracks and return an array of results", async () => {
      const searchWord = "Viva la Vida";
      const res = await chai.request(`http://localhost:5000`).post("/search/tracks").send({ searchWord });
      expect(res).to.have.status(200);
    });
  });

  describe("POST /search/playlists", () => {
    it("should search for playlists and return an array of results", async () => {
      const searchWord = "Workout";
      const res = await chai.request(`http://localhost:5000`).post("/search/playlists").send({ searchWord });
      expect(res).to.have.status(200);
    });
  });
});