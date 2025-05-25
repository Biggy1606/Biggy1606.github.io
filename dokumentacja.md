# Wizualizator Otoczki Wypukłej

## Opis aplikacji

Wizualizator Otoczki Wypukłej to interaktywna aplikacja webowa umożliwiająca eksplorację i zrozumienie koncepcji otoczki wypukłej w geometrii obliczeniowej. Aplikacja pozwala na dodawanie punktów, manipulowanie nimi oraz obserwowanie w czasie rzeczywistym, jak różne algorytmy obliczają otoczkę wypukłą.

## Co to jest otoczka wypukła?

Otoczka wypukła zbioru punktów na płaszczyźnie to najmniejszy wielokąt wypukły zawierający wszystkie te punkty. Można to sobie wyobrazić jako kształt, który powstałby po naciągnięciu gumki wokół wszystkich punktów - gumka naturalnie przyjmie kształt otoczki wypukłej.

## Funkcjonalności aplikacji

### Zarządzanie punktami

#### Dodawanie punktów
- **Losowe punkty**: Przycisk "Add Random Point" dodaje punkt w losowym miejscu na płótnie
- **Punkt centralny**: "Add Center Point" umieszcza punkt w centrum płótna
- **Klikanie na płótnie**: Bezpośrednie dodawanie punktów przez kliknięcie w wybrane miejsce
- **Masowe dodawanie**: Możliwość dodania wielu punktów jednocześnie (1-100)

#### Organizacja punktów
- **Mieszanie punktów**: "Scramble Points" losowo przemieszcza wszystkie aktywne punkty
- **Układanie w okrąg**: "Arrange in Circle" rozmieszcza punkty równomiernie na okręgu
- **Czyszczenie punktów**: "Clean Points" usuwa punkty znajdujące się zbyt blisko siebie (domyślnie <5 pikseli)

### Dynamiczne zarządzanie płótnem

#### Zmiana rozmiaru
- **Kontrolki liczbowe**: Bezpośrednie wprowadzanie szerokości i wysokości (200-1200px)
- **Suwaki**: Interaktywna zmiana rozmiaru z natychmiastowym podglądem
- **Predefiniowane rozmiary**: Szybki wybór popularnych formatów:
  - 300×300 (mały kwadrat)
  - 400×400 (domyślny rozmiar)
  - 600×400 (szeroki prostokąt)
  - 800×600 (duży format)

#### Inteligentne dostosowanie
Po zmianie rozmiaru płótna aplikacja automatycznie:
- Przeskalowuje istniejące punkty do nowych granic
- Aktualizuje promień układania w okrąg
- Przelicza otoczkę wypukłą jeśli tryb ciągły jest włączony

### Manipulacja punktami

#### Tryb przeciągania
- **Włączanie**: Przycisk "Enable Dragging" aktywuje możliwość przeciągania punktów
- **Podświetlanie**: Punkty możliwe do przeciągnięcia są wyróżniane przy najechaniu myszą
- **Ograniczenia**: Punkty pozostają w granicach płótna z zachowaniem marginesów
- **Synchronizacja**: Współrzędne automatycznie aktualizują się w kontrolkach

#### Indywidualne sterowanie
Każdy punkt posiada własne kontrolki:
- **Checkbox**: Aktywacja/dezaktywacja punktu
- **Pola X/Y**: Precyzyjne ustawienie współrzędnych
- **Przycisk usuwania**: Trwałe usunięcie punktu

### Algorytmy obliczania otoczki wypukłej

Aplikacja implementuje dwa klasyczne algorytmy:

#### Skanowanie Grahama (Graham Scan)
**Zasada działania:**
1. Znalezienie punktu o najniższej współrzędnej Y (przy remisie - najbardziej lewego)
2. Sortowanie pozostałych punktów według kąta polarnego względem punktu bazowego
3. Budowanie otoczki przez usuwanie punktów tworzących zakręty w prawo

**Charakterystyka:**
- Złożoność czasowa: O(n log n) - głównie przez sortowanie
- Bardzo efektywny dla większych zbiorów punktów
- Deterministyczny wynik niezależny od kolejności danych wejściowych

#### Marsz Jarvisa (Jarvis March / Gift Wrapping)
**Zasada działania:**
1. Rozpoczęcie od skrajnie lewego punktu
2. Dla każdego punktu otoczki znajdowanie następnego przez sprawdzenie wszystkich pozostałych punktów
3. Wybór punktu tworzącego największy kąt skierowany w lewo
4. Kontynuacja aż do powrotu do punktu startowego

**Charakterystyka:**
- Złożoność czasowa: O(nh), gdzie h to liczba punktów na otoczce
- Efektywny gdy otoczka ma mało wierzchołków
- Intuicyjny algorytm - "owijanie prezentu"

### Tryby pracy aplikacji

#### Tryb ciągłego obliczania
- **"Enable Live Hull"**: Otoczka przeliczana jest automatycznie przy każdej zmianie
- **Idealne do eksploracji**: Natychmiastowa wizualizacja wpływu zmian
- **Edukacyjne**: Pokazuje jak ruchy punktów wpływają na kształt otoczki

#### Sterowanie płótnem
- **"Pause Canvas"**: Zatrzymuje odświeżanie rysowania (oszczędza zasoby)
- **"Resume Canvas"**: Wznawia animację i interaktywność

### Panel statystyk

Aplikacja wyświetla w czasie rzeczywistym:
- **Liczba punktów**: Ogólna i aktywnych punktów
- **Wierzchołki otoczki**: Liczba punktów tworzących otoczkę
- **Użyty algorytm**: Graham Scan lub Jarvis March
- **Rozmiar płótna**: Aktualne wymiary w pikselach

### Zaawansowane funkcje

#### Walidacja danych
- Sprawdzanie poprawności współrzędnych
- Kontrola granic płótna
- Zabezpieczenie przed nieprawidłowymi wartościami

#### Responsywność
- **Mobile-first**: Projektowane z myślą o urządzeniach mobilnych
- **Touch-friendly**: Przyciski o odpowiednim rozmiarze dla dotyku
- **Adaptacyjny layout**: Automatyczne dostosowanie do rozmiaru ekranu

#### Obsługa błędów
- Komunikaty o błędach z automatycznym znikaniem
- Walidacja danych wejściowych
- Graceful degradation przy problemach

## Zastosowania edukacyjne

### Dla studentów informatyki
- **Wizualizacja algorytmów**: Obserwowanie działania różnych metod
- **Porównanie wydajności**: Testowanie na różnych zestawach danych
- **Zrozumienie złożoności**: Praktyczne doświadczenie z O(n log n) vs O(nh)

### Dla nauczycieli
- **Demonstracje na żywo**: Interaktywne prezentacje algorytmów
- **Eksperymenty**: Pokazywanie różnych przypadków testowych
- **Porównania**: Jednoczesne użycie dwóch algorytmów

### Przypadki użycia
1. **Najlepszy przypadek**: Punkty już na otoczce (np. układ w okrąg)
2. **Najgorszy przypadek**: Wszystkie punkty na otoczce w losowej kolejności
3. **Przypadek średni**: Mieszanka punktów wewnętrznych i brzegowych

## Technologie

### Frontend
- **HTML5 Canvas**: Za pośrednictwem biblioteki p5.js
- **Vanilla JavaScript**: Bez zewnętrznych frameworków
- **CSS Grid/Flexbox**: Responsywny layout
- **Progressive Enhancement**: Działanie na wszystkich przeglądarkach

### Architektura
- **Modułowy kod**: Jasno oddzielone funkcjonalności
- **Event-driven**: Reagowanie na działania użytkownika
- **State management**: Centralne zarządzanie stanem aplikacji

## Przyszłe rozszerzenia

Możliwe kierunki rozwoju:
- **Więcej algorytmów**: QuickHull, Divide and Conquer
- **Animacje krok po kroku**: Pokazywanie procesu obliczania
- **Eksport danych**: Zapisywanie punktów i wyników
- **Metryki wydajności**: Pomiar czasu wykonania algorytmów
- **3D wizualizacja**: Rozszerzenie na przestrzeń trójwymiarową

Aplikacja stanowi kompleksowe narzędzie do nauki i eksploracji geometrii obliczeniowej, łącząc solidną podstawę teoretyczną z intuicyjnym interfejsem użytkownika.