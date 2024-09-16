void setup() {
  pinMode(8, OUTPUT);  //aktiver pin 8 som er lysdiode 1 på BB
  pinMode(9, OUTPUT);  //aktiver pin 9 som er lysdiode 2 på BB
}

void loop() {
  digitalWrite(8, HIGH);  // Sæt pin 8 (lysdiode 1) høj = tænd
  digitalWrite(9, HIGH);  // Sæt pin 9 (lysdiode 2) høj = tænd
  delay(1000);            // Vent i 1000 millisekunder = 1 sekund
  digitalWrite(8, LOW);   // Sæt pin 8 (lysdiode 1) lav = sluk
  digitalWrite(9, LOW);   // Sæt pin 9 (lysdiode 2) lav = sluk
  delay(1000);            // Vent i 1000 millisekunder = 1 sekund
}