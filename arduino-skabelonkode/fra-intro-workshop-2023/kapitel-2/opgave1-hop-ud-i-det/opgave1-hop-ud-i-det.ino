const int potMeterPin = A1;
int potMeterVaerdi;

const float omregningsFaktor = 5. / 1023.;
float antalVolt;

const int vent = 1000;

void setup() {
  Serial.begin(9600);
}

void loop() {
  potMeterVaerdi = analogRead(potMeterPin);
  antalVolt = omregningsFaktor * potMeterVaerdi;
  Serial.print("Den aflæste værdi fra A1..: ");
  Serial.println(potMeterVaerdi);
  Serial.print("Potentiometer volt er.....: ");
  Serial.println(antalVolt);
  Serial.println();
  delay(vent);
}