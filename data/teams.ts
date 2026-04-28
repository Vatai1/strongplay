export interface Player {
  nickname: string;
  role: string;
  avatar: string;
}

export interface Team {
  game: string;
  logo: string;
  players: Player[];
}

export const teams: Team[] = [
  {
    game: "Counter-Strike 2",
    logo: "/images/games/cs2.png",
    players: [
      { nickname: "Player1", role: "Капитан / IGL", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player2", role: "AWP", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player3", role: "Rifler", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player4", role: "Rifler", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player5", role: "Entry", avatar: "/images/avatars/placeholder.png" },
    ],
  },
  {
    game: "Dota 2",
    logo: "/images/games/dota2.png",
    players: [
      { nickname: "Player1", role: "Carry", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player2", role: "Mid", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player3", role: "Offlane", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player4", role: "Support 4", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player5", role: "Support 5", avatar: "/images/avatars/placeholder.png" },
    ],
  },
  {
    game: "Valorant",
    logo: "/images/games/valorant.png",
    players: [
      { nickname: "Player1", role: "Duelist", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player2", role: "Controller", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player3", role: "Initiator", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player4", role: "Sentinel", avatar: "/images/avatars/placeholder.png" },
      { nickname: "Player5", role: "Flex", avatar: "/images/avatars/placeholder.png" },
    ],
  },
];
