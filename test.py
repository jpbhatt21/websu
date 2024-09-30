def bezier(t):
    return t*t*(3.0 - 2.0*t)

def lerp(a, b, t):
    return a + (b - a) * t

print(bezier(float(input())))

