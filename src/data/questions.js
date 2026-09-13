// Each question has one problem statement, judged by stdin -> stdout matching.
// Starter code is provided per language; testcases are language-agnostic.

export const questions = [
  {
    id: "r1q1",
    round: 1,
    title: "Sum of Two Numbers",
    description:
      "Read two space-separated integers A and B from standard input and print their sum.",
    sample_input: "5 10",
    sample_output: "15",
    testcases: [
      { input: "5 10", output: "15" },
      { input: "-3 8", output: "5" },
      { input: "0 0", output: "0" },
    ],
    starter: {
      c: `#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", a + b);\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}\n`,
      python: `a, b = map(int, input().split())\nprint(a + b)\n`,
    },
  },
  {
    id: "r1q2",
    round: 1,
    title: "Reverse a String",
    description:
      "Read a single line string and print it reversed.",
    sample_input: "brain2code",
    sample_output: "edoc2niarb",
    testcases: [
      { input: "brain2code", output: "edoc2niarb" },
      { input: "srimt", output: "tmirs" },
      { input: "a", output: "a" },
    ],
    starter: {
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    fgets(s, sizeof(s), stdin);\n    int len = strlen(s);\n    if (len > 0 && s[len - 1] == '\\n') { s[len - 1] = '\\0'; len--; }\n    for (int i = len - 1; i >= 0; i--) putchar(s[i]);\n    printf("\\n");\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}\n`,
      python: `s = input()\nprint(s[::-1])\n`,
    },
  },
  {
    id: "r1q3",
    round: 1,
    title: "Factorial",
    description:
      "Read an integer N and print N! (factorial). Assume 0 <= N <= 12.",
    sample_input: "5",
    sample_output: "120",
    testcases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
      { input: "7", output: "5040" },
    ],
    starter: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    long long fact = 1;\n    for (int i = 2; i <= n; i++) fact *= i;\n    printf("%lld\\n", fact);\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long fact = 1;\n        for (int i = 2; i <= n; i++) fact *= i;\n        System.out.println(fact);\n    }\n}\n`,
      python: `n = int(input())\nfact = 1\nfor i in range(2, n + 1):\n    fact *= i\nprint(fact)\n`,
    },
  },
  {
    id: "r2q1",
    round: 2,
    title: "Palindrome Check",
    description:
      "Read a single word and print YES if it is a palindrome, otherwise print NO.",
    sample_input: "level",
    sample_output: "YES",
    testcases: [
      { input: "level", output: "YES" },
      { input: "brain", output: "NO" },
      { input: "madam", output: "YES" },
    ],
    starter: {
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    scanf("%s", s);\n    int len = strlen(s);\n    int ok = 1;\n    for (int i = 0; i < len / 2; i++) {\n        if (s[i] != s[len - 1 - i]) { ok = 0; break; }\n    }\n    printf("%s\\n", ok ? "YES" : "NO");\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        String r = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(r) ? "YES" : "NO");\n    }\n}\n`,
      python: `s = input().strip()\nprint("YES" if s == s[::-1] else "NO")\n`,
    },
  },
  {
    id: "r2q2",
    round: 2,
    title: "Second Largest in Array",
    description:
      "Read N, then N space-separated integers. Print the second largest distinct value.",
    sample_input: "5\n4 1 9 9 3",
    sample_output: "4",
    testcases: [
      { input: "5\n4 1 9 9 3", output: "4" },
      { input: "3\n10 20 30", output: "20" },
      { input: "4\n5 5 5 2", output: "2" },
    ],
    starter: {
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[1000];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int first = -2147483648, second = -2147483648;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] > first) { second = first; first = arr[i]; }\n        else if (arr[i] > second && arr[i] != first) { second = arr[i]; }\n    }\n    printf("%d\\n", second);\n    return 0;\n}\n`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;\n        for (int x : arr) {\n            if (x > first) { second = first; first = x; }\n            else if (x > second && x != first) { second = x; }\n        }\n        System.out.println(second);\n    }\n}\n`,
      python: `n = int(input())\narr = list(map(int, input().split()))\nfirst = second = float("-inf")\nfor x in arr:\n    if x > first:\n        second = first\n        first = x\n    elif x > second and x != first:\n        second = x\nprint(second)\n`,
    },
  },
];

export const ROUND_CONFIG = {
  1: { durationMinutes: 20, requiredSolves: 2 },
  2: { durationMinutes: 10, requiredSolves: 1 },
};
