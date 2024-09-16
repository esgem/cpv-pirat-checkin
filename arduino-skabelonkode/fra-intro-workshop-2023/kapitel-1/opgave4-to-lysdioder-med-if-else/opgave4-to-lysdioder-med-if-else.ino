void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
}

void loop() {                   // START
  if (digitalRead(8) == LOW) {  // Hvis pin 8 er lav = slukket
    digitalWrite(8, HIGH);      // Tænd pin 8
    digitalWrite(9, LOW);       // Sluk pin 9
  } else {                      // Ellers (hvis pin 8 er høj = tændt)
    digitalWrite(8, LOW);       // Sluk pin 8
    digitalWrite(9, HIGH);      // Tænd pin 9
  }
  delay(1000);  // Vent 1 sekund
}