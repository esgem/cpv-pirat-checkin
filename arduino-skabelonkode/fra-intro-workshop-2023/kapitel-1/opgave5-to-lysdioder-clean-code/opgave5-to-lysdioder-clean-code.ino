const int pause = 1000;
const int red = 8;    // Rød på pin 8
const int green = 9;  // Grøn på pin 9

void setup() {
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  if (digitalRead(red) == LOW) { // hvis rød er slukket
    start(red);
    stop(green);
  } else {  // hvis rød er tændt
    stop(red);
    start(green);
  }
  delay(pause);
}

// funktion til at tænde en pin
void start(int pin) {
  digitalWrite(pin, HIGH);
}

// funktion til at slukke en pin
void stop(int pin) {
  digitalWrite(pin, LOW);
}