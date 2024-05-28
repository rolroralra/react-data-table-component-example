export function getRandomNumber(min = 1, max = 3) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}