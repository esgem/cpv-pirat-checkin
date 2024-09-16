void setup() {
  pinMode(13, OUTPUT);  // Aktiver pin 13, som er lysdioden på printet
}

void loop() {
  digitalWrite(13, HIGH);  // Her sættes pin 13 høj = tænd dioden
  delay(3000);             // Hvor længe skal den være tændt (3 sekunder)
  digitalWrite(13, LOW);   // Her sættes pin 13 lav = sluk dioden igen
  delay(2000);             // Hvor længe skal den være slukket (2 sekunder)
}