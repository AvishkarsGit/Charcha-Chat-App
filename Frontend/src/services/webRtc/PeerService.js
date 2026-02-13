class PeerService {
  constructor() {
    this.peer = null;
  }

  createPeer(onIce, onTrack) {
    this.peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    this.peer.onicecandidate = (e) => {
      if (e.candidate) onIce(e.candidate);
    };

    this.peer.ontrack = (e) => {
      onTrack(e.streams[0]);
    };

    return this.peer;
  }

  addTracks(stream) {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream);
    });
  }

  async createOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer) {
    await this.peer.setRemoteDescription(offer);
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  async setAnswer(answer) {
    await this.peer.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate) {
    await this.peer.addIceCandidate(candidate);
  }
  close() {
    if (this.peer) {
      this.peer.ontrack = null;
      this.peer.onicecandidate = null;
      this.peer.close();
      this.peer = null;
    }
  }
}

export const peerService = new PeerService();
