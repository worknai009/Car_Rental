const router = require("express").Router();
const ctrl = require("../../controllers/admin/admin.car.controller");
const jwtUtils = require("../../utils/jwt");

router.get("/", jwtUtils.authMiddleware("admin"), ctrl.getCars);
router.get("/:id", jwtUtils.authMiddleware("admin"), ctrl.getCarById);

// ✅ ADD THIS
router.post("/", jwtUtils.authMiddleware("admin"), ctrl.createCar);

router.put("/:id", jwtUtils.authMiddleware("admin"), ctrl.updateCar);
router.delete("/:id", jwtUtils.authMiddleware("admin"), ctrl.deleteCar);

// availability endpoint:
router.put(
  "/:id/availability",
  jwtUtils.authMiddleware("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { is_available } = req.body;

    await require("../../config/db").exe(
      "UPDATE cars SET is_available=? WHERE id=?",
      [Number(is_available), id]
    );

    res.json({ message: "Availability updated" });
  }
);

module.exports = router;
