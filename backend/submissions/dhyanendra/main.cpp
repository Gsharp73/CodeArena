#include <bits/stdc++.h>
using namespace std;
#define ll long long
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int tt; cin >> tt;
    while (tt--) {
        int a, b, c;
        cin >> a >> b >> c;
        int x, y, z = c;
        y = 2 * z + b;
        x = 2 * y + a;
        cout << x << " " << y << " " << z << endl;
        // cout << x % y << " " << y % z << " " << z % x << endl;
    }
}

