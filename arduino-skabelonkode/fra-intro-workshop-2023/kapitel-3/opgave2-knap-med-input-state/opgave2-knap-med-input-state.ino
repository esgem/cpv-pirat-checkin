const int knapPin = 2;  // knappen sidder på PIN 2
int knapTrykTaeller;    // variabel til at tælle antal tryk på knappen

int sidsteKnapStatus;  // variabel til at huske den sidste status

void setup() {
  pinMode(knapPin, INPUT);  // sæt den til input, så vi kan læse
  Serial.begin(9600);       // udskriv til den serielle monitor
  knapTrykTaeller = 0;      // nulstil tælleren

  sidsteKnapStatus = digitalRead(knapPin);  // Start-tilstand for knap-status

  Serial.print("Antal tryk  = ");
  Serial.println(knapTrykTaeller);
  Serial.println();
}

void loop() {
  int knapStatus = digitalRead(knapPin); // nuværende status

  if (knapStatus != sidsteKnapStatus) {  // er status ændret siden sidst?
    sidsteKnapStatus = knapStatus; // gem nuværende status som ny sidste status

    if (knapStatus == HIGH) {  // knappen er blevet trykket ned
      knapTrykTaeller++;       // tæl én op
      Serial.print("X ");

    } else {  // knappen er blevet sluppet igen
      if (knapTrykTaeller > 0) {
        // Udskriv hvor mange gange vi har talt et tryk på knappen
        Serial.println();
        Serial.print("Antal tryk  = ");
        Serial.println(knapTrykTaeller);
        Serial.println();
        knapTrykTaeller = 0;  // nulstil tælleren igen
      }
    }
  }
}