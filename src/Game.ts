class Game {
  greet() {
    console.log('Testing');
  }
}

window.onload = () => {
  const game = new Game();
  game.greet();
};
